from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Veritabanı bağlantı URL’sini buraya yaz (gerekirse .env dosyasından da alabilirsin)
DATABASE_URL = "postgresql://postgres:7808@localhost:5432/restaurant"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
