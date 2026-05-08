from rest_framework import serializers
from .models import Material, Usuario, Conteudo, Recomendacao, UsuarioConteudo


# ============================================================
# Material (Compatibilidade com API existente)
# ============================================================
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


# ============================================================
# Usuario
# ============================================================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'login', 'email', 'criado_em']
        read_only_fields = ['id_usuario', 'criado_em']

    def create(self, validated_data):
        # Em produção, fazer hashing da senha com bcrypt
        return Usuario.objects.create(**validated_data)


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
        fields = ['conteudo', 'conteudo_detalhes', 'usuario', 'usuario_nome', 'salvo_em']
        read_only_fields = ['salvo_em']
