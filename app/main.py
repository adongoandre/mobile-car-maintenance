from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, database
from .database import get_db

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Car Maintenance API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to Car Maintenance API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "car-maintenance-api"}

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user