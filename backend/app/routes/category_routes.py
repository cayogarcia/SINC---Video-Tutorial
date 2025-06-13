from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import category_crud
from app.schemas import category_schema

router = APIRouter()

@router.get("", response_model=List[category_schema.Category])
def list_categories(db: Session = Depends(get_db)):
    return category_crud.get_all_categories(db)

@router.get("/{category_id}", response_model=category_schema.Category)
def get_category(category_id: str, db: Session = Depends(get_db)):
    category = category_crud.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return category

@router.post("", response_model=category_schema.Category, status_code=201)
def create_category(category: category_schema.CategoryCreate, db: Session = Depends(get_db)):
    db_category = category_crud.get_category_by_name(db, category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Categoria já cadastrada")
    return category_crud.create_category(db, category)

@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    deleted = category_crud.delete_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return
