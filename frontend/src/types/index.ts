export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  password: string;
  role: UserRole;
}

export type UserUpdate = Omit<User, 'id'> & {
  password?: string;  // opcional para updates
};

export interface Video {
  id: string;
  title: string;
  link: string;
  category_id: string;
  allowed_users: string[]; // Array of user IDs
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
