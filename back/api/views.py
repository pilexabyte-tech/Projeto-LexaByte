from django.shortcuts import render
from rest_framework import generics
from .models import Material, Usuario, Conteudo, Recomendacao, UsuarioConteudo
from .serializers import (
    MaterialSerializer,
    UsuarioSerializer,
    ConteudoSerializer,
    RecomendacaoSerializer,
    UsuarioConteudoSerializer,
)

# ============================================================
# Material (Compatibilidade com API existente)
# ============================================================
class MaterialListCreateView(generics.ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class MaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


# ============================================================
# Usuario
# ============================================================
class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'id_usuario'


# ============================================================
# Conteudo
# ============================================================
class ConteudoListCreateView(generics.ListCreateAPIView):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer
    filterset_fields = ['tipo']


class ConteudoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer
    lookup_field = 'id_conteudo'


# ============================================================
# Recomendacao
# ============================================================
class RecomendacaoListCreateView(generics.ListCreateAPIView):
    queryset = Recomendacao.objects.all()
    serializer_class = RecomendacaoSerializer


class RecomendacaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recomendacao.objects.all()
    serializer_class = RecomendacaoSerializer
    lookup_field = 'id_recomendacao'


# ============================================================
# UsuarioConteudo
# ============================================================
class UsuarioConteudoListCreateView(generics.ListCreateAPIView):
    queryset = UsuarioConteudo.objects.all()
    serializer_class = UsuarioConteudoSerializer


class UsuarioConteudoDetailView(generics.RetrieveDestroyAPIView):
    queryset = UsuarioConteudo.objects.all()
    serializer_class = UsuarioConteudoSerializer
