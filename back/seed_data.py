#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexabyte.settings')
django.setup()

from api.models import Material

# Limpar dados antigos
Material.objects.all().delete()

# Dados de teste
materiais = [
    {
        'titulo': 'Introdução ao Python',
        'descricao': 'Um guia completo para iniciantes em Python',
        'tipo': 'LIVRO',
        'autor_ou_criador': 'Mark Lutz',
        'link_acesso': 'https://exemplo.com/python-intro'
    },
    {
        'titulo': 'Programação Web com Django',
        'descricao': 'Aprenda a criar aplicações web modernas com Django',
        'tipo': 'CURSO',
        'autor_ou_criador': 'Real Python',
        'link_acesso': 'https://exemplo.com/django-course'
    },
    {
        'titulo': 'REST APIs Best Practices',
        'descricao': 'Artigo acadêmico sobre design de APIs REST',
        'tipo': 'ARTIGO',
        'autor_ou_criador': 'Roy Fielding',
        'link_acesso': 'https://exemplo.com/rest-best-practices'
    },
    {
        'titulo': 'JavaScript Para Todos',
        'descricao': 'Vídeo tutorial sobre JavaScript moderno',
        'tipo': 'VIDEO',
        'autor_ou_criador': 'Wes Bos',
        'link_acesso': 'https://exemplo.com/js-video'
    },
    {
        'titulo': 'Docker e Containerização',
        'descricao': 'Guia prático sobre Docker e containers',
        'tipo': 'LIVRO',
        'autor_ou_criador': 'John Doe',
        'link_acesso': 'https://exemplo.com/docker-guide'
    },
]

for material_data in materiais:
    Material.objects.create(**material_data)
    print(f"✓ Criado: {material_data['titulo']}")

print(f"\n✓ Total de {Material.objects.count()} materiais adicionados ao banco de dados!")
