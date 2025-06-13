from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models.models import User
from app.database import get_db
import hashlib

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Busca usuário pelo login
    user = db.query(User).filter(User.login == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha inválidos"
        )

    # Hash da senha informada
    senha_hash = hash_password(form_data.password)

    if user.password == senha_hash:
        # Senha já está em hash no banco, ok
        pass
    elif user.password == form_data.password:
        # Senha no banco está em texto simples → atualiza com hash
        user.password = senha_hash
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha inválidos"
        )

    # Autenticação bem-sucedida
    return {
        "access_token": "fake-token",
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "login": user.login,
            "role": user.role,
        }
    }



