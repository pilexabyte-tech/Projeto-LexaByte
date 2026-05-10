from django.urls import path
from .views import (
    # Material
    MaterialListCreateView,
    MaterialDetailView,
    # Usuario
    UsuarioListCreateView,
    UsuarioDetailView,
    # Conteudo
    ConteudoListCreateView,
    ConteudoDetailView,
    # Recomendacao
    RecomendacaoListCreateView,
    RecomendacaoDetailView,
    # UsuarioConteudo
    UsuarioConteudoListCreateView,
    UsuarioConteudoDetailView,
)

urlpatterns = [
    # ============================================================
    # Material (Legacy - compatibilidade)
    # ============================================================
    path('materiais/', MaterialListCreateView.as_view(), name='material-list'),
    path('materiais/<int:pk>/', MaterialDetailView.as_view(), name='material-detail'),

    # ============================================================
    # Usuario
    # ============================================================
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuario-list'),
    path('usuarios/<int:id_usuario>/', UsuarioDetailView.as_view(), name='usuario-detail'),

    # ============================================================
    # Conteudo
    # ============================================================
    path('conteudos/', ConteudoListCreateView.as_view(), name='conteudo-list'),
    path('conteudos/<int:id_conteudo>/', ConteudoDetailView.as_view(), name='conteudo-detail'),

    # ============================================================
    # Recomendacao
    # ============================================================
    path('recomendacoes/', RecomendacaoListCreateView.as_view(), name='recomendacao-list'),
    path('recomendacoes/<int:id_recomendacao>/', RecomendacaoDetailView.as_view(), name='recomendacao-detail'),

    # ============================================================
    # UsuarioConteudo (lista do usuário)
    # ============================================================
    path('usuario-conteudo/', UsuarioConteudoListCreateView.as_view(), name='usuario-conteudo-list'),
    path('usuario-conteudo/<int:pk>/', UsuarioConteudoDetailView.as_view(), name='usuario-conteudo-detail'),
]
