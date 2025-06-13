from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.models import User
from app.schemas.user_schema import UserCreate, UserUpdate
from uuid import uuid4
import hashlib

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_login(db: Session, login: str) -> Optional[User]:
    return db.query(User).filter(User.login == login).first()

def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = User(
        id=str(uuid4()),
        name=user.name,
        email=user.email,
        login=user.login,
        password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, user_update: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()  # Corrigido aqui (UserModel -> User)
    if not user:
        return None
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False

    db.delete(db_user)
    db.commit()
    return True

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


