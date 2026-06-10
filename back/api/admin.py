from django.contrib import admin
from .models import Conteudo, Material, Recomendacao, Usuario, UsuarioConteudo

admin.site.register(Material)
admin.site.register(Usuario)
admin.site.register(Conteudo)
admin.site.register(Recomendacao)
admin.site.register(UsuarioConteudo)

