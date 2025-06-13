from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import video_crud
from app.schemas.video_schema import VideoOut, VideoCreate, VideoUpdate

router = APIRouter()

def video_to_dict(db_video):
    return {
        "id": db_video.id,
        "title": db_video.title,
        "link": db_video.link,
        "category_id": db_video.category_rel.id if db_video.category_rel else None,
        "category": {
            "id": db_video.category_rel.id,
            "name": db_video.category_rel.name
        } if db_video.category_rel else None,
        "allowed_users": [user.id for user in db_video.allowed_users],  # já lista de IDs pelo CRUD
        "users_count": len(db_video.allowed_users),
        "created_at": db_video.created_at,
        "updated_at": db_video.updated_at
    }

@router.get("", response_model=List[VideoOut])
def list_videos(db: Session = Depends(get_db)):
    return video_crud.get_all_videos_detalhado(db)

@router.get("/{video_id}", response_model=VideoOut)
def get_video(video_id: str, db: Session = Depends(get_db)):
    db_video = video_crud.get_video_by_id(db, video_id)
    if not db_video:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    return video_to_dict(db_video)

@router.post("", response_model=VideoOut, status_code=201)
def create_video(video: VideoCreate, db: Session = Depends(get_db)):
    db_video = video_crud.create_video(db, video)
    return video_to_dict(db_video)

@router.put("/{video_id}", response_model=VideoOut)
def update_video(video_id: str, video: VideoUpdate, db: Session = Depends(get_db)):
    updated = video_crud.update_video(db, video_id, video)
    if not updated:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    return video_to_dict(updated)

@router.delete("/{video_id}", status_code=204)
def delete_video(video_id: str, db: Session = Depends(get_db)):
    deleted = video_crud.delete_video(db, video_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")

