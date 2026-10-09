from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import Category
from app.schemas.category_schema import CategoryCreate, CategoryUpdate
from uuid import uuid4

def get_all_categories(db: Session) -> List[Category]:
    return db.query(Category).all()

def get_category_by_id(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()

def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    return db.query(Category).filter(Category.name == name).first()

def create_category(db: Session, category: CategoryCreate) -> Category:
    new_category = Category(
        id=str(uuid4()),
        name=category.name.strip()
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def update_category(db: Session, category_id: str, category: CategoryUpdate) -> Optional[Category]:
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        return None
    db_category.name = category.name.strip()
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: str) -> bool:
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        return False
    db.delete(db_category)
    db.commit()
    return True

