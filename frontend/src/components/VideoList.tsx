import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Video } from '../types';
import VideoForm from './VideoForm';
import { Edit, Trash2, Plus, Users } from 'lucide-react';

type Category = { id: string; name: string };
const API_URL = 'https://ajuda.sincsuite.com.br';

const VideoList: React.FC = () => {
  const { user, getAllUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<Video | undefined>(undefined);
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const isAdmin = user?.role === 'admin';

  const fetchAndFilterVideos = useCallback(async () => {
    try {
      const { data: allVideos } = await axios.get<Video[]>(`${API_URL}/videos`);

      const videosVisibleToUser = isAdmin
        ? allVideos
        : allVideos.filter(video => (video.allowed_users || []).includes(user?.id || ''));

      const filteredBySearch = videosVisibleToUser.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const filteredByCategory = filteredBySearch.filter(video =>
        selectedCategory ? video.category_id === selectedCategory : true
      );

      setVideos(filteredByCategory);

      const { data: categories } = await axios.get<Category[]>(`${API_URL}/categories`);
      const uniqueCategoryIds = new Set(videosVisibleToUser.map(video => video.category_id));
      const visibleCategories = categories.filter(cat => uniqueCategoryIds.has(cat.id));
      setAllCategories(visibleCategories);
    } catch (error) {
      console.error('Erro ao carregar vídeos ou categorias:', error);
      setVideos([]);
      setAllCategories([]);
    }
  }, [isAdmin, user?.id, searchTerm, selectedCategory]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const result = getAllUsers();
      const allUsers = result instanceof Promise ? await result : result;
      setUsers(allUsers || []);
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      setUsers([]);
    }
  }, [getAllUsers, isAdmin]);

  useEffect(() => {
    fetchAndFilterVideos();
    loadUsers();
  }, [fetchAndFilterVideos, loadUsers]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAndFilterVideos();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchAndFilterVideos]);

  const handleAddVideo = () => {
    setVideoToEdit(undefined);
    setShowForm(true);
  };

  const handleEditVideo = (video: Video) => {
    setVideoToEdit(video);
    setShowForm(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      await axios.delete(`${API_URL}/videos/${videoId}`);
      fetchAndFilterVideos();
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  const getUsersWithAccess = (video: Video): string => {
    const allowed = users.filter(u => (video.allowed_users || []).includes(u.id));
    return `${allowed.length} usuário${allowed.length !== 1 ? 's' : ''}`;
  };

  const handleFormClose = (refresh?: boolean) => {
    setShowForm(false);
    setVideoToEdit(undefined);
    if (refresh) fetchAndFilterVideos();
  };

  const getEmbedUrl = (url: string): string => {
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    } catch {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Vídeos Tutoriais</h2>

        {isAdmin && (
          <button
            onClick={handleAddVideo}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Vídeo
          </button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar vídeo
          </label>
          <input
            type="text"
            id="search"
            placeholder="Digite o nome do vídeo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todas as categorias</option>
            {allCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                <iframe
                  src={getEmbedUrl(video.link)}
                  title={video.title}
                  className="w-full h-48 object-cover"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{video.title}</h3>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {getCategoryName(video.category_id)}
                  </span>

                  {isAdmin && (
                    <div className="flex items-center ml-3 text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {getUsersWithAccess(video)}
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => handleEditVideo(video)}
                      className="inline-flex items-center px-2 py-1 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="inline-flex items-center px-2 py-1 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">Nenhum vídeo encontrado.</p>
          <p className="text-sm mt-2">
            {isAdmin
              ? 'Adicione um novo vídeo usando o botão acima.'
              : 'Não há vídeos disponíveis para você no momento.'}
          </p>
        </div>
      )}

      {showForm && (
        <VideoForm
          onClose={handleFormClose}
          videoToEdit={videoToEdit}
        />
      )}
    </div>
  );
};

export default VideoList;





















