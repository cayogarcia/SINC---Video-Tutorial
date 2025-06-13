import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface CategoryFormProps {
  onClose: (refresh?: boolean) => void;
}

interface Category {
  id: string;
  name: string;
}

const API_URL = 'https://ajuda.sincsuite.com.br';

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>(`${API_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Erro ao carregar categorias', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
    );

    if (alreadyExists) {
      setError('Essa categoria já existe');
      return;
    }

    try {
      await axios.post(`${API_URL}/categories`, {
        name: categoryName.trim(),
      });

      onClose(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao adicionar categoria');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Adicionar Categoria
          </h2>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Nome da Categoria
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError('');
              }}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                error ? 'border-red-300' : ''
              }`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;




