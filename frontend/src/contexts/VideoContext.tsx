import React, { createContext, useContext, ReactNode } from 'react';
import { Video, Category } from '../types';

interface VideoContextType {
  getAllVideos: () => Promise<Video[]>;
  getVideoById: (id: string) => Promise<Video | undefined>;
  getVideosByCategory: (categoryId: string) => Promise<Video[]>;
  getVideosByUser: (userId: string) => Promise<Video[]>;
  addVideo: (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Video | null>;
  updateVideo: (video: Video) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getAllCategories: () => Promise<Category[]>;
  getCategoryById: (id: string) => Promise<Category | undefined>;
  addCategory: (name: string) => Promise<Category | null>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType>({
  getAllVideos: async () => [],
  getVideoById: async () => undefined,
  getVideosByCategory: async () => [],
  getVideosByUser: async () => [],
  addVideo: async () => null,
  updateVideo: async () => {},
  deleteVideo: async () => {},
  getAllCategories: async () => [],
  getCategoryById: async () => undefined,
  addCategory: async () => null,
  updateCategory: async () => {},
  deleteCategory: async () => {},
});

export const useVideos = () => useContext(VideoContext);

interface VideoProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://ajuda.sincsuite.com.br';

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const getAllVideos = async (): Promise<Video[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos`);
      return await res.json();
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      return [];
    }
  };

  const getVideoById = async (id: string): Promise<Video | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos/${id}`);
      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  const getVideosByCategory = async (categoryId: string): Promise<Video[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos?category=${categoryId}`);
      return await res.json();
    } catch {
      return [];
    }
  };

  const getVideosByUser = async (userId: string): Promise<Video[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos?user=${userId}`);
      return await res.json();
    } catch {
      return [];
    }
  };

  const addVideo = async (
    videoData: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Video | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const updateVideo = async (video: Video): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
    }
  };

  const deleteVideo = async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/videos/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
    }
  };

  const getAllCategories = async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      return await res.json();
    } catch {
      return [];
    }
  };

  const getCategoryById = async (id: string): Promise<Category | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!res.ok) return undefined;
      return await res.json();
    } catch {
      return undefined;
    }
  };

  const addCategory = async (name: string): Promise<Category | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const updateCategory = async (category: Category): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  const contextValue: VideoContextType = {
    getAllVideos,
    getVideoById,
    getVideosByCategory,
    getVideosByUser,
    addVideo,
    updateVideo,
    deleteVideo,
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <VideoContext.Provider value={contextValue}>
      {children}
    </VideoContext.Provider>
  );
};



