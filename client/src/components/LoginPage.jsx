import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useColorModeValue,
  CircularProgress,
  Alert,
  AlertIcon
} from '@chakra-ui/react';


const LoginPage = ({ onToggle }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('----------------->>>>>')
    setIsLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/login',
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } } // Set Content-Type header to application/json
      );
      console.log(response.data)
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('fname', response.data.fname);
      localStorage.setItem('lname', response.data.lname);
      setLoggedIn(true);
      // Clear input fields
      setEmail('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Login failed:', error.message); // Handle login error
      setError('Invalid email or password'); // Set error message
    }
    setIsLoading(false);
  };

  if (loggedIn) {
    navigate('/recommendation')
  }

  return (
    <div>
      <Box minH="80vh" display="flex" alignItems="center" justifyContent="center" bg={useColorModeValue('gray.50', 'gray.800')}>
        <Box p={8} minWidth="400px" width="30%" borderWidth={1} borderRadius={8} boxShadow="lg" bg={useColorModeValue('white', 'gray.700')}>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Box my={4} textAlign="left">
            <Box textAlign="center">
              <Heading>Login</Heading>
            </Box>
            <form>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                </FormControl>
                <Button width="full" onClick={handleSubmit} mt={4} type="submit" colorScheme="teal">
                  {isLoading ? (
                    <CircularProgress isIndeterminate size="24px" color="white" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </VStack>
            </form>
          </Box>
          <Box textAlign="center">
            <Text>Don't have an account?</Text>
            <Link as={RouterLink} to="/" color="teal.500">Register here</Link>
          </Box>
        </Box>
      </Box>
    </div>
  )
};

export default LoginPage;
