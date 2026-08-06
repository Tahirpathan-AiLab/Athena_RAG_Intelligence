import os
import sys
import subprocess

backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)

from app.database import Base, engine

Base.metadata.create_all(bind=engine)

cmd = [
    os.path.join(os.path.dirname(sys.executable), "python.exe"),
    "-m",
    "uvicorn",
    "app.main:app",
    "--host",
    "127.0.0.1",
    "--port",
    "8000",
]

print("Starting backend with:", " ".join(cmd))
subprocess.call(cmd)
