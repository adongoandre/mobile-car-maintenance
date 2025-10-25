import sys
import os
import asyncio

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../../backend'))

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db, engine
from app import models
from mangum import Mangum

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Car Maintenance API")

@app.get("/")
async def root():
    return {"message": "Hello from Netlify Functions!", "status": "success"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "car-maintenance-api"}

@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return {"users": [{"id": u.id, "email": u.email, "name": u.full_name} for u in users]}

@app.post("/users")
async def create_user(email: str, full_name: str, db: Session = Depends(get_db)):
    db_user = models.User(email=email, full_name=full_name, hashed_password="temp")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "email": db_user.email, "name": db_user.full_name}

# Mangum handler for Netlify Functions
handler = Mangum(app)