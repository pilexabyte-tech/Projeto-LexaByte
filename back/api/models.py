from django.db import models

# ============================================================
# Usuario
# ============================================================
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True, db_column='ID_Usuario')
    nome = models.CharField(max_length=100, db_column='Nome')
    login = models.CharField(max_length=100, unique=True, db_column='Login')
    senha = models.CharField(
        max_length=255,
        db_column='Senha',
        help_text='Senha armazenada com hash.',
    )
    email = models.EmailField(max_length=150, blank=True, null=True, unique=True, db_column='Email')
    is_admin = models.BooleanField(default=False, db_column='Is_Admin')
    criado_em = models.DateTimeField(auto_now_add=True, db_column='Criado_em')

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return f"{self.nome} ({self.login})"

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def is_superuser(self):
        return self.is_admin


# ============================================================
# Conteudo
# ============================================================
class Conteudo(models.Model):
    TIPO_CHOICES = [
        ('livro', 'Livro'),
        ('filme', 'Filme'),
        ('serie', 'Série'),
    ]

    id_conteudo = models.AutoField(primary_key=True, db_column='ID_Conteudo')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, db_column='Tipo')
    titulo = models.CharField(max_length=255, db_column='Titulo')
    descricao = models.TextField(blank=True, null=True, db_column='Descricao')
    capa_url = models.CharField(max_length=500, blank=True, null=True, db_column='Capa_URL')
    # NOVIDADE AQUI: O link agora é uma propriedade global de qualquer Conteúdo!
    link = models.CharField(max_length=500, blank=True, null=True, db_column='Link')
    ano = models.IntegerField(blank=True, null=True, db_column='Ano')
    criado_em = models.DateTimeField(auto_now_add=True, db_column='Criado_em')

    class Meta:
        db_table = 'conteudo'

    def __str__(self):
        return f"{self.titulo} ({self.tipo})"


# ============================================================
# Recomendacao
# ============================================================
class Recomendacao(models.Model):
    id_recomendacao = models.AutoField(primary_key=True, db_column='idRecomendacao')
    conteudo = models.ForeignKey(Conteudo, on_delete=models.CASCADE, db_column='idConteudo')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='idUsuario')
    # O campo 'link' foi removido daqui pois agora pertence ao Conteudo de forma geral
    criado_em = models.DateTimeField(auto_now_add=True, db_column='Criado_em')

    class Meta:
        db_table = 'recomendacao'

    def __str__(self):
        return f"Recomendação de {self.conteudo.titulo} para {self.usuario.nome}"


# ============================================================
# UsuarioConteudo (histórico/lista do usuário)
# ============================================================
class UsuarioConteudo(models.Model):
    conteudo = models.ForeignKey(Conteudo, on_delete=models.CASCADE, db_column='ID_Conteudo')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='ID_Usuario')
    salvo_em = models.DateTimeField(auto_now_add=True, db_column='Salvo_em')

    class Meta:
        db_table = 'usuario_conteudo'
        unique_together = ('conteudo', 'usuario')

    def __str__(self):
        return f"{self.usuario.nome} — {self.conteudo.titulo}"


# ============================================================
# Material (compatibilidade API - alias para Conteudo)
# ============================================================
class Material(models.Model):
    """Mantido para compatibilidade com API existente"""
    TIPO_CHOICES = [
        ('LIVRO', 'Livro'),
        ('VIDEO', 'Vídeo'),
        ('ARTIGO', 'Artigo Acadêmico'),
        ('CURSO', 'Curso'),
        ('OUTRO', 'Outro Formato'),
    ]
    
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    autor_ou_criador = models.CharField(max_length=150)
    link_acesso = models.URLField(blank=True, null=True)
    data_adicao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'material'

    def __str__(self):
        return self.titulo
