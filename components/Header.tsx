import React from 'react';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-8 pb-12">
      <LogoIcon className="h-8 mb-3 text-blue-500" />
      <h1 className="text-3xl font-bold text-gray-800">OO대학교</h1>
      <p className="text-md text-gray-500 mt-1">캠퍼스 남색</p>
    </header>
  );
};

export default Header;