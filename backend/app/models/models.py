from sqlalchemy import Column, String, ForeignKey, Table, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

video_user_association = Table(
    'video_user_association',
    Base.metadata,
    Column('video_id', String, ForeignKey('videos.id')),
    Column('user_id', String, ForeignKey('users.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    login = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(50))
    
    videos = relationship('Video', secondary=video_user_association, back_populates='allowed_users')


class Category(Base):
    __tablename__ = 'categories'
    
    id = Column(String, primary_key=True, index=True)  # UUID como string
    name = Column(String(300), nullable=False, unique=True)
    
    videos = relationship('Video', back_populates='category_rel')


class Video(Base):
    __tablename__ = 'videos'
    
    id = Column(String, primary_key=True, index=True)  # UUID como string
    title = Column(String(300), nullable=False)
    link = Column(String(500), nullable=False)
    category_id = Column(String, ForeignKey('categories.id'))
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted = Column(Boolean, default=False)
    
    category_rel = relationship('Category', back_populates='videos')
    allowed_users = relationship('User', secondary=video_user_association, back_populates='videos')
