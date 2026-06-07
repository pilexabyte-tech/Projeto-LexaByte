import os
import multiprocessing

bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
keepalive = 5
timeout = 30
max_requests = 1000
max_requests_jitter = 50
preload_app = True
daemon = False
umask = 0
accesslog = '-'
errorlog = '-'
loglevel = 'info'
