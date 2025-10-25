from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from . import models, database
from .database import get_db

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Car Maintenance API", version="1.0.0")

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Car Maintenance API!", "deployed_on": "netlify"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "car-maintenance-api"}

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/")
def create_user(email: str, full_name: str, db: Session = Depends(get_db)):
    # Simple user creation for testing
    db_user = models.User(email=email, full_name=full_name, hashed_password="temp")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Netlify serverless function handler
def handler(event, context):
    from mangum import Mangum
    handler = Mangum(app)
    return handler(event, context)