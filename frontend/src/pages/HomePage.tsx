import React from 'react';
import VideoList from '../components/VideoList';
import UserList from '../components/UserList';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VideoList />
      <UserList />
    </div>
  );
};

export default HomePage;