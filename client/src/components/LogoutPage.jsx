// import React from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@chakra-ui/react';

// const LogoutPage = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/logout',
//       {withCredentials: true});
//       console.log(response.data);
//       // Redirect to login page after successful logout
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed:', error.message);
//       // Handle logout error
//     }
//   };

//   return (
//     <Button
//       colorScheme="teal"
//       variant="solid"
//       onClick={handleLogout}
//     >
//       Logout
//     </Button>
//   );
// };

// export default LogoutPage;
