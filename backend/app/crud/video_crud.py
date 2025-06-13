from sqlalchemy.orm import Session, joinedload
from app.models.models import Video, User
from app.schemas.video_schema import VideoCreate, VideoUpdate
from typing import List, Optional
from datetime import datetime
import uuid


def get_all_videos(db: Session) -> List[Video]:
    videos = db.query(Video).options(
        joinedload(Video.category_rel),
        joinedload(Video.allowed_users)
    ).filter(Video.deleted == False).all()
    return videos


def get_video_by_id(db: Session, video_id: str) -> Optional[Video]:
    video = db.query(Video).options(
        joinedload(Video.category_rel),
        joinedload(Video.allowed_users)
    ).filter(Video.id == video_id, Video.deleted == False).first()

    return video


def create_video(db: Session, video: VideoCreate) -> Video:
    new_video = Video(
        id=str(uuid.uuid4()),
        title=video.title,
        link=video.link,
        category_id=video.category_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        deleted=False
    )

    if video.allowed_users:
        users = db.query(User).filter(User.id.in_(video.allowed_users)).all()
        new_video.allowed_users = users

    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return new_video


def update_video(db: Session, video_id: str, video: VideoUpdate) -> Optional[Video]:
    db_video = db.query(Video).filter(Video.id == video_id, Video.deleted == False).first()
    if not db_video:
        return None

    db_video.title = video.title
    db_video.link = video.link
    db_video.category_id = video.category_id
    db_video.updated_at = datetime.utcnow()

    if video.allowed_users is not None:
        if len(video.allowed_users) == 0:
            # Limpa todas as permissões
            db_video.allowed_users = []
        else:
            users = db.query(User).filter(User.id.in_(video.allowed_users)).all()
            db_video.allowed_users = users

    db.commit()
    db.refresh(db_video)

    return db_video


def delete_video(db: Session, video_id: str) -> bool:
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if db_video:
        db_video.deleted = True
        db.commit()
        return True
    return False


def get_all_videos_detalhado(db: Session):
    videos = db.query(Video).options(
        joinedload(Video.category_rel),
        joinedload(Video.allowed_users)
    ).filter(Video.deleted == False).all()

    result = []
    for video in videos:
        video_data = {
            "id": video.id,
            "title": video.title,
            "link": video.link,
            "category_id": video.category_rel.id if video.category_rel else None,
            "category": {
                "id": video.category_rel.id,
                "name": video.category_rel.name
            } if video.category_rel else None,
            "allowed_users": [user.id for user in video.allowed_users],
            "users_count": len(video.allowed_users),
            "created_at": video.created_at,
            "updated_at": video.updated_at
        }
        result.append(video_data)

    return result




