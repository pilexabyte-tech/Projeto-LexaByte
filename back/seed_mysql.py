#!/usr/bin/env python
"""
Script para popular o banco MySQL com dados de teste
Execute após: python manage.py migrate
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexabyte.settings')
django.setup()

from api.models import Usuario, Conteudo, Recomendacao, UsuarioConteudo

print("\n" + "=" * 60)
print("🌱 LexaByte MySQL Seeder")
print("=" * 60)

# Limpar dados antigos
print("\n[1/3] Limpando dados antigos...")
Usuario.objects.all().delete()
Conteudo.objects.all().delete()
Recomendacao.objects.all().delete()
UsuarioConteudo.objects.all().delete()
print("✓ Base limpa")

# Criar usuários
print("\n[2/3] Criando usuários...")
usuarios_data = [
    {
        'nome': 'João Silva',
        'login': 'joao_silva',
        'senha': 'senha_hash_123',  # Em produção, usar hashing real
        'email': 'joao@example.com'
    },
    {
        'nome': 'Maria Santos',
        'login': 'maria_santos',
        'senha': 'senha_hash_456',
        'email': 'maria@example.com'
    },
    {
        'nome': 'Pedro Oliveira',
        'login': 'pedro_oliveira',
        'senha': 'senha_hash_789',
        'email': 'pedro@example.com'
    },
]

usuarios = {}
for user_data in usuarios_data:
    user = Usuario.objects.create(**user_data)
    usuarios[user.login] = user
    print(f"  ✓ {user.nome}")

# Criar conteúdos
print("\n[3/3] Criando conteúdos...")
conteudos_data = [
    {
        'tipo': 'livro',
        'titulo': 'Dom Casmurro',
        'descricao': 'Romance clássico de Machado de Assis sobre Bentinho e Capitu',
        'capa_url': 'https://exemplo.com/dom-casmurro.jpg',
        'ano': 1899
    },
    {
        'tipo': 'livro',
        'titulo': 'Grande Sertão: Veredas',
        'descricao': 'Obra-prima de Guimarães Rosa sobre o sertão mineiro',
        'capa_url': 'https://exemplo.com/grande-sertao.jpg',
        'ano': 1956
    },
    {
        'tipo': 'livro',
        'titulo': 'Capitães da Areia',
        'descricao': 'Romance de Jorge Amado sobre crianças abandonadas de Salvador',
        'capa_url': 'https://exemplo.com/capitaes-da-areia.jpg',
        'ano': 1937
    },
    {
        'tipo': 'filme',
        'titulo': 'Cidade de Deus',
        'descricao': 'Filme de Fernando Meirelles sobre a vida no Rio de Janeiro',
        'capa_url': 'https://exemplo.com/cidade-de-deus.jpg',
        'ano': 2002
    },
    {
        'tipo': 'filme',
        'titulo': 'Memórias Póstumas de Brás Cubas',
        'descricao': 'Adaptação da obra de Machado de Assis para o cinema',
        'capa_url': 'https://exemplo.com/brás-cubas.jpg',
        'ano': 1985
    },
    {
        'tipo': 'serie',
        'titulo': 'Conversa com Bial',
        'descricao': 'Série de entrevistas com personalidades brasileiras',
        'capa_url': 'https://exemplo.com/conversa-bial.jpg',
        'ano': 2000
    },
]

conteudos = {}
for cont_data in conteudos_data:
    cont = Conteudo.objects.create(**cont_data)
    conteudos[cont.titulo] = cont
    print(f"  ✓ {cont.titulo} ({cont.tipo})")

# Criar recomendações e adicionar à lista do usuário
print("\n[4/4] Criando recomendações e relacionamentos...")
recomendacoes_mapping = [
    ('joao_silva', 'Dom Casmurro', 'https://exemplo.com/dom-casmurro-completo'),
    ('joao_silva', 'Capitães da Areia', 'https://exemplo.com/capitaes-completo'),
    ('maria_santos', 'Grande Sertão: Veredas', 'https://exemplo.com/grande-sertao-completo'),
    ('maria_santos', 'Cidade de Deus', 'https://exemplo.com/cidade-completo'),
    ('pedro_oliveira', 'Memórias Póstumas de Brás Cubas', None),
]

for usuario_login, conteudo_titulo, link in recomendacoes_mapping:
    usuario = usuarios[usuario_login]
    conteudo = conteudos[conteudo_titulo]
    
    # Criar recomendação
    Recomendacao.objects.create(
        usuario=usuario,
        conteudo=conteudo,
        link=link
    )
    
    # Adicionar à lista do usuário
    UsuarioConteudo.objects.create(
        usuario=usuario,
        conteudo=conteudo
    )
    print(f"  ✓ {usuario.nome} → {conteudo.titulo}")

# Adicionar mais conteúdos à lista de alguns usuários
print("\n✓ Adicionando conteúdos extras às listas...")
for titulo in ['Grande Sertão: Veredas', 'Capitães da Areia']:
    cont = conteudos[titulo]
    user = usuarios['pedro_oliveira']
    UsuarioConteudo.objects.get_or_create(usuario=user, conteudo=cont)
    print(f"  ✓ {user.nome} → {cont.titulo}")

print("\n" + "=" * 60)
print(f"✓ Seed concluído com sucesso!")
print(f"  • {len(usuarios)} usuários criados")
print(f"  • {len(conteudos)} conteúdos criados")
print(f"  • {Recomendacao.objects.count()} recomendações criadas")
print(f"  • {UsuarioConteudo.objects.count()} itens em listas de usuários")
print("=" * 60 + "\n")
