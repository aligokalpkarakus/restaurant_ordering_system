from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.recipe import RecipeCreate, RecipeOut
from app.models.recipe import Recipe
from app.db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[RecipeOut])
def get_recipes(db: Session = Depends(get_db)):
    return db.query(Recipe).all()

@router.post("/", response_model=RecipeOut)
def add_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = Recipe(**recipe.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe 