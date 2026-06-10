from rest_framework import authentication, exceptions

from .models import Usuario


class UsuarioTokenAuthentication(authentication.BaseAuthentication):
    keyword = 'Token'

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode('utf-8')
        if not header:
            return None

        parts = header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            return None

        token = parts[1]
        if not token.startswith('token_'):
            raise exceptions.AuthenticationFailed('Token invalido.')

        try:
            usuario_id = int(token.replace('token_', '', 1))
        except ValueError as exc:
            raise exceptions.AuthenticationFailed('Token invalido.') from exc

        usuario = Usuario.objects.filter(id_usuario=usuario_id).first()
        if not usuario:
            raise exceptions.AuthenticationFailed('Usuario nao encontrado.')

        return (usuario, token)
