import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import UserForm from './UserForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://ajuda.sincsuite.com.br'; // Centralize a base se quiser reutilizar

const UserList: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${API_URL}/users` /*, {
        headers: { Authorization: `Bearer ${token}` } // Se usar auth token
      }*/);
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!user || user.role !== 'admin') return null;

  const handleAddUser = () => {
    setUserToEdit(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (!userId) return;
    if (user.id === userId) {
      alert('Você não pode excluir sua própria conta.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}` /*, {
          headers: { Authorization: `Bearer ${token}` } // Se usar auth token
        }*/);
        fetchUsers(); // Atualiza a lista após deletar
      } catch (error) {
        console.error('Erro ao excluir usuário', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Usuários Cadastrados</h2>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </button>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.login}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`Editar usuário ${user.name}`}
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Excluir usuário ${user.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Nenhum usuário cadastrado.
        </div>
      )}

      {showForm && (
        <UserForm
          onClose={() => {
            setShowForm(false);
            fetchUsers(); // Garante atualização após fechar o formulário
          }}
          userToEdit={userToEdit}
        />
      )}
    </div>
  );
};

export default UserList;




