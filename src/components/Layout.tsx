import React from 'react';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {/* Footer can be added here if needed */}
    </Box>
  );
};

export default Layout;
