from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import video_routes, user_routes, category_routes, auth_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SINC Vídeos API",
    description="API para gerenciamento de vídeos, usuários e categorias.",
    version="1.0.0",
    redirect_slashes=True
)

# Middleware CORS — deve vir antes dos include_router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["ajuda.sincsuite.com.br"],  # ou use ["*"] para testes abertos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão das rotas
app.include_router(video_routes.router, prefix="/videos", tags=["videos"])
app.include_router(user_routes.router, prefix="/users", tags=["users"])
app.include_router(category_routes.router, prefix="/categories", tags=["categories"])
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])

# Rota raiz
@app.get("/")
def read_root():
    return {"message": "SINC Vídeos API está rodando com sucesso"}
