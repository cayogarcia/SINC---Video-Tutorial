from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CategoryOut(BaseModel):
    id: str
    name: str

    class Config:
        orm_mode = True

class VideoBase(BaseModel):
    title: str
    link: str
    category_id: str
    allowed_users: List[str] = Field(default_factory=list)

class VideoCreate(VideoBase):
    pass

class VideoUpdate(VideoBase):
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

class VideoOut(BaseModel):
    id: str
    title: str
    link: str
    category_id: Optional[str]
    category: Optional[CategoryOut] = None
    allowed_users: List[str] = Field(default_factory=list)
    users_count: int = 0
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
        populate_by_name = True

# Remova esta classe se não for usada em nenhum lugar
# class Video(VideoBase):
#     id: str
#     created_at: Optional[datetime]
#     updated_at: Optional[datetime]

#     class Config:
#         orm_mode = True
#         populate_by_name = True



