#!/usr/bin/env python
"""
Script para popular o banco MySQL com dados de teste
Execute após: python manage.py migrate
"""
import os
import django
from urllib.parse import quote_plus

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


def archive_search_link(titulo, mediatype):
    query = quote_plus(f'"{titulo}" AND mediatype:{mediatype}')
    return f'https://archive.org/search?query={query}'


conteudos_data = [
    {
        'tipo': 'livro',
        'titulo': 'Dom Casmurro',
        'descricao': 'Romance clássico de Machado de Assis sobre Bentinho e Capitu',
        'capa_url': None,
        'ano': 1899,
    },
    {
        'tipo': 'filme',
        'titulo': 'O Pagador de Promessas',
        'descricao': 'Clássico de Anselmo Duarte sobre fé, promessa e injustiça social',
        'capa_url': None,
        'ano': 1962,
    },
    {
        'tipo': 'serie',
        'titulo': 'O Bem-Amado',
        'descricao': 'Série clássica inspirada na obra de Dias Gomes e no cotidiano político brasileiro',
        'capa_url': None,
        'ano': 1973,
    },
    {
        'tipo': 'livro',
        'titulo': 'Grande Sertão: Veredas',
        'descricao': 'Obra-prima de Guimarães Rosa sobre o sertão mineiro e seus dilemas',
        'capa_url': None,
        'ano': 1956,
    },
    {
        'tipo': 'filme',
        'titulo': 'Vidas Secas',
        'descricao': 'Adaptação do romance de Graciliano Ramos sobre a seca e a sobrevivência no sertão',
        'capa_url': None,
        'ano': 1963,
    },
    {
        'tipo': 'serie',
        'titulo': 'Sítio do Picapau Amarelo',
        'descricao': 'Adaptação televisiva do universo infantil de Monteiro Lobato',
        'capa_url': None,
        'ano': 1977,
    },
    {
        'tipo': 'livro',
        'titulo': 'Capitães da Areia',
        'descricao': 'Romance de Jorge Amado sobre crianças abandonadas de Salvador',
        'capa_url': None,
        'ano': 1937,
    },
    {
        'tipo': 'filme',
        'titulo': 'Macunaíma',
        'descricao': 'Longa de Joaquim Pedro de Andrade inspirado na obra de Mário de Andrade',
        'capa_url': None,
        'ano': 1969,
    },
    {
        'tipo': 'serie',
        'titulo': 'Carga Pesada',
        'descricao': 'Série clássica sobre estrada, trabalho e amizade entre caminhoneiros',
        'capa_url': None,
        'ano': 1979,
    },
    {
        'tipo': 'livro',
        'titulo': 'Memórias Póstumas de Brás Cubas',
        'descricao': 'Narrativa inovadora de Machado de Assis, marco do realismo brasileiro',
        'capa_url': None,
        'ano': 1881,
    },
    {
        'tipo': 'filme',
        'titulo': 'Terra em Transe',
        'descricao': 'Filme de Glauber Rocha sobre crise política e tensão no Brasil',
        'capa_url': None,
        'ano': 1967,
    },
    {
        'tipo': 'serie',
        'titulo': 'Malu Mulher',
        'descricao': 'Série pioneira sobre independência feminina e conflitos urbanos',
        'capa_url': None,
        'ano': 1979,
    },
    {
        'tipo': 'livro',
        'titulo': 'O Cortiço',
        'descricao': 'Clássico naturalista de Aluísio Azevedo sobre desigualdade e vida coletiva',
        'capa_url': None,
        'ano': 1890,
    },
    {
        'tipo': 'filme',
        'titulo': 'Limite',
        'descricao': 'Obra silenciosa de Mário Peixoto, referência do cinema brasileiro',
        'capa_url': None,
        'ano': 1931,
    },
    {
        'tipo': 'serie',
        'titulo': 'Armação Ilimitada',
        'descricao': 'Série marcante dos anos 80 que misturou humor, juventude e cultura pop',
        'capa_url': None,
        'ano': 1985,
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
    ('joao_silva', 'Dom Casmurro', archive_search_link('Dom Casmurro', 'texts')),
    ('joao_silva', 'O Pagador de Promessas', archive_search_link('O Pagador de Promessas', 'movies')),
    ('maria_santos', 'Grande Sertão: Veredas', archive_search_link('Grande Sertão: Veredas', 'texts')),
    ('maria_santos', 'O Bem-Amado', archive_search_link('O Bem-Amado', 'movies')),
    ('pedro_oliveira', 'Macunaíma', archive_search_link('Macunaíma', 'movies')),
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
