from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import user_crud
from app.schemas import user_schema

router = APIRouter()

@router.get("/teste")
def test():
    return {"msg": "Rota /users funcionando"}

@router.get("/", response_model=List[user_schema.User])
def get_all_users(db: Session = Depends(get_db)):
    users = user_crud.get_all_users(db)
    return users

@router.get("/{user_id}", response_model=user_schema.User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.post("/", response_model=user_schema.User)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return user_crud.create_user(db, user)

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    deleted = user_crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return Response(status_code=204)

@router.put("/{user_id}", response_model=user_schema.User)
def update_user(user_id: str, user_update: user_schema.UserUpdate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    updated_user = user_crud.update_user(db, user_id, user_update)
    return updated_user
