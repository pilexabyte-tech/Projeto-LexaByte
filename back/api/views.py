from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .authentication import UsuarioTokenAuthentication
from .models import Material, Usuario, Conteudo, Recomendacao, UsuarioConteudo
from .serializers import (
    MaterialSerializer,
    UsuarioSerializer,
    ConteudoSerializer,
    RecomendacaoSerializer,
    UsuarioConteudoSerializer,
    LoginSerializer,
    RegisterSerializer,
)

# ============================================================
# Authentication
# ============================================================
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            return Response({
                'token': f'token_{usuario.id_usuario}',
                'id': usuario.id_usuario,
                'username': usuario.login,
                'email': usuario.email,
                'nome': usuario.nome,
                'is_admin': usuario.is_admin,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response({
                'token': f'token_{usuario.id_usuario}',
                'id': usuario.id_usuario,
                'username': usuario.login,
                'email': usuario.email,
                'nome': usuario.nome,
                'is_admin': usuario.is_admin,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# Material (Compatibilidade com API existente)
# ============================================================
class IsAutorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        role = str(
            getattr(user, 'role', '') or
            getattr(user, 'papel', '') or
            getattr(user, 'tipo', '') or
            getattr(user, 'perfil', '')
        ).lower()

        if role in ('autor', 'admin') or user.is_staff or user.is_superuser:
            return True
        groups = getattr(user, 'groups', None)
        return bool(groups and groups.filter(name__in=['autor', 'admin']).exists())


class IsUsuarioAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(getattr(request.user, 'is_admin', False))


class MaterialListCreateView(generics.ListCreateAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    authentication_classes = [UsuarioTokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAutorOrAdmin()]
        return [AllowAny()]


class MaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    authentication_classes = [UsuarioTokenAuthentication]

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsAuthenticated(), IsUsuarioAdmin()]
        return [AllowAny()]


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo']
    authentication_classes = [UsuarioTokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]


class ConteudoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer
    lookup_field = 'id_conteudo'
    authentication_classes = [UsuarioTokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsUsuarioAdmin()]


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
    serializer_class = UsuarioConteudoSerializer
    authentication_classes = [UsuarioTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UsuarioConteudo.objects.filter(usuario=self.request.user).select_related('conteudo', 'usuario')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class UsuarioConteudoDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = UsuarioConteudoSerializer
    authentication_classes = [UsuarioTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UsuarioConteudo.objects.filter(usuario=self.request.user).select_related('conteudo', 'usuario')
