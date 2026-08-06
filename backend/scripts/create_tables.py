from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)

print("Tables created successfully.")
