import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { Box, Flex } from '@chakra-ui/react';
import VerticalNavbar from './VerticalNavbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/login', '/register', '/'];

  const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <Flex>
      {showNavbar && <VerticalNavbar />}
      <Box flex="1" p="4">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;