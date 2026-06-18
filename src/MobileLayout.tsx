import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MobileMainPage from '@pages/mobile/MobileMainPage.tsx';

const MobileLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileMainPage />} />
    </Routes>
  );
};

export default MobileLayout;
