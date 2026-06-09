#!/usr/bin/env python
import http.server
import socketserver
import os
from pathlib import Path

# Configuração
PORT = 5500
PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONT_END_DIR = PROJECT_ROOT / "front" / "src"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONT_END_DIR, **kwargs)

os.chdir(FRONT_END_DIR)

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✓ Servidor front-end rodando em http://127.0.0.1:{PORT}/")
    print(f"✓ Servindo arquivos de: {FRONT_END_DIR}")
    print(f"✓ Backend API em http://127.0.0.1:8000/api/")
    print("\nAbra em seu navegador: http://127.0.0.1:5500/index.html")
    print("Pressione Ctrl+C para parar o servidor\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Servidor encerrado")
