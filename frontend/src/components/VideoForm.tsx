import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Video } from '../types';
import { X, Plus, Check } from 'lucide-react';
import CategoryForm from './CategoryForm';
import axios from 'axios';

interface VideoFormProps {
  onClose: () => void;
  videoToEdit?: Video;
}

const API_URL = 'https://ajuda.sincsuite.com.br';

const VideoForm: React.FC<VideoFormProps> = ({ onClose, videoToEdit }) => {
  const { getAllUsers } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    category_id: '',
    allowedUsers: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; role: string }[]>([]);

  // Carrega usuários do backend via contexto Auth (filtra só role 'user')
  const loadUsers = useCallback(async () => {
    try {
      const all = await getAllUsers();
      const onlyUsers = all.filter(u => u.role === 'user');
      setUsers(onlyUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }, [getAllUsers]);

  // Carrega categorias e usuários no início
  useEffect(() => {
    fetchCategories();
    loadUsers();
  }, [loadUsers]);

  // Se for editar, popula o formulário com dados do vídeo
  useEffect(() => {
    if (videoToEdit) {
      setFormData({
        title: videoToEdit.title || '',
        link: videoToEdit.link || '',
        category_id: videoToEdit.category_id || '',
        allowedUsers: videoToEdit.allowed_users || [],
      });
    } else {
      setFormData({
        title: '',
        link: '',
        category_id: '',
        allowedUsers: [],
      });
    }
  }, [videoToEdit]);

  // Função para buscar categorias do backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ id: string; name: string }[]>(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  // Handle inputs do formulário (title, link, category_id)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle seleção de usuário para permissão
  const handleUserToggle = (userId: string) => {
    setFormData(prev => {
      const isSelected = prev.allowedUsers.includes(userId);
      return {
        ...prev,
        allowedUsers: isSelected
          ? prev.allowedUsers.filter(id => id !== userId)
          : [...prev.allowedUsers, userId],
      };
    });
  };

  // Validação simples do formulário
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.link.trim()) {
      newErrors.link = 'Link é obrigatório';
    } else {
      try {
        new URL(formData.link);
      } catch {
        newErrors.link = 'Link inválido';
      }
    }
    if (!formData.category_id) newErrors.category_id = 'Categoria é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit do formulário: cria ou atualiza vídeo via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title,
      link: formData.link,
      category_id: formData.category_id,
      allowed_users: formData.allowedUsers,
    };

    setTimeout(async () => {
      try {
        if (videoToEdit) {
          await axios.put(`${API_URL}/videos/${videoToEdit.id}`, payload);
        } else {
          await axios.post(`${API_URL}/videos`, payload);
        }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
    }
  }, 1000); // <- Delay de 1000ms (1 segundo)
};
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {videoToEdit ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título do Vídeo
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                  errors.title ? 'border-red-300' : ''
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Link do Vídeo
              </label>
              <input
                type="text"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                  errors.link ? 'border-red-300' : ''
                }`}
              />
              {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Categoria
                </button>
              </div>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`mt-1 block w-full border-gray-300 rounded-md sm:text-sm ${
                  errors.category_id ? 'border-red-300' : ''
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuários que podem visualizar ({formData.allowedUsers.length} selecionados)
              </label>
              {users.length > 0 ? (
                <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto p-2">
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => handleUserToggle(user.id)}
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded border ${
                          formData.allowedUsers.includes(user.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.allowedUsers.includes(user.id) && (
                          <Check className="text-white w-4 h-4" />
                        )}
                      </div>
                      <span className="select-none">{user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum usuário encontrado.</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCategoryForm && (
        <CategoryForm
          onClose={(refresh = false) => {
            setShowCategoryForm(false);
            if (refresh) fetchCategories();
          }}
        />
      )}
    </>
  );
};

export default VideoForm;












