from rest_framework import serializers
from .models import Material, Usuario, Conteudo, Recomendacao, UsuarioConteudo


# ============================================================
# Material (Compatibilidade com API existente)
# ============================================================
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            'titulo',
            'descricao',
            'tipo',
            'autor_ou_criador',
            'link_acesso',
            'data_adicao'
        ]


# ============================================================
# Usuario
# ============================================================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'login', 'email', 'is_admin', 'criado_em']
        read_only_fields = ['id_usuario', 'is_admin', 'criado_em']

    def create(self, validated_data):
        # Em produção, fazer hashing da senha com bcrypt
        return Usuario.objects.create(**validated_data)


# ============================================================
# Login
# ============================================================
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = (data.get('username') or '').strip()
        password = data.get('password') or ''

        # Tenta buscar por login ou por email, sem diferenciar maiúsculas/minúsculas
        usuario = Usuario.objects.filter(login__iexact=username).first() or Usuario.objects.filter(email__iexact=username).first()
        if not usuario:
            raise serializers.ValidationError('Invalid credentials')
        if usuario.senha != password:
            raise serializers.ValidationError('Invalid credentials')
        
        return {'usuario': usuario}


# ============================================================
# Register
# ============================================================
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    nome = serializers.CharField(required=False)

    def validate(self, data):
        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip()
        
        if Usuario.objects.filter(login__iexact=username).exists():
            raise serializers.ValidationError('Username already exists')
        if Usuario.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('Email already exists')
        
        return data

    def create(self, validated_data):
        usuario = Usuario.objects.create(
            nome=validated_data.get('nome', validated_data['username']),
            login=validated_data['username'].strip(),
            email=validated_data['email'].strip(),
            senha=validated_data['password']
        )
        return usuario


# ============================================================
# Conteudo
# ============================================================
class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = ['id_conteudo', 'tipo', 'titulo', 'descricao', 'capa_url', 'ano', 'criado_em']
        read_only_fields = ['id_conteudo', 'criado_em']


# ============================================================
# Recomendacao
# ============================================================
class RecomendacaoSerializer(serializers.ModelSerializer):
    conteudo_titulo = serializers.CharField(source='conteudo.titulo', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)

    class Meta:
        model = Recomendacao
        fields = ['id_recomendacao', 'conteudo', 'conteudo_titulo', 'usuario', 'usuario_nome', 'link', 'criado_em']
        read_only_fields = ['id_recomendacao', 'criado_em']


# ============================================================
# UsuarioConteudo
# ============================================================
class UsuarioConteudoSerializer(serializers.ModelSerializer):
    conteudo_detalhes = ConteudoSerializer(source='conteudo', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)

    class Meta:
        model = UsuarioConteudo
        fields = ['id', 'conteudo', 'conteudo_detalhes', 'usuario', 'usuario_nome', 'salvo_em']
        read_only_fields = ['id', 'usuario', 'usuario_nome', 'salvo_em']

    def validate(self, data):
        request = self.context.get('request')
        usuario = getattr(request, 'user', None)
        conteudo = data.get('conteudo')

        if usuario and conteudo and UsuarioConteudo.objects.filter(usuario=usuario, conteudo=conteudo).exists():
            raise serializers.ValidationError('Conteudo ja esta nos favoritos.')

        return data
