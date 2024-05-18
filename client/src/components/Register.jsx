import React, { useState } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Dropzone from './Dropzone';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link,
  useColorModeValue,
  Grid,
  GridItem
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SkillsForm from './SkillsForm';

const RegisterPage = ({ onToggle }) => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resume, setResume] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const [schoolName, setSchoolName] = useState('');
  const [major, setMajor] = useState('');
  const [educationStartDate, setEducationStartDate] = useState(new Date());
  const [educationEndDate, setEducationEndDate] = useState(new Date());

  const [employerName, setEmployerName] = useState('');
  const [position, setPosition] = useState('');
  const [experienceStartDate, setExperienceStartDate] = useState(new Date());
  const [experienceEndDate, setExperienceEndDate] = useState(new Date());

  const handleStartDateChange = (type, date) => {
    if (type === 'education') {
      setEducationStartDate(date);
    } else if (type === 'work') {
      setExperienceStartDate(date);
    }
  };

  const handleEndDateChange = (type, date) => {
    if (type === 'education') {
      setEducationEndDate(date);
    } else if (type === 'work') {
      setExperienceEndDate(date);
    }
  };


  const handleFileUpload = (file) => {
    // setResume(e.target.files[0]);
    // const file = e.target.files[0]
    pdfToText(file)
      .then(text => setResume(text))
      .catch(error => console.error("Failed to extract text from pdf"))
  };

  const data = {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }


    const formData = new FormData();
    formData.append('fullname', username);
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password2', confirmPassword);
    formData.append('resume', resume); // Append the file object to FormData
    formData.append('skills', JSON.stringify(tags));
    formData.append('education', JSON.stringify({
        schoolName,
        major,
        startDate: educationStartDate,
        endDate: educationEndDate
    }));
    formData.append('workExperience', JSON.stringify({
        employerName,
        position,
        startDate: experienceStartDate,
        endDate: experienceEndDate
    }));
    
    for (var [key, value] of formData.entries()) {
      data[key] = value;
    }

    try {
      const response = await axios.post('http://localhost:5000', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data);
      setMessage(response.data.message);
      navigate('/login')
    } catch (error) {
      console.error('Registration failed:', error.message);
      setMessage('Registration failed');
    }
  };

  return (
    <div>
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={useColorModeValue('gray.50', 'gray.800')}>
        <Box p={8} minWidth="600px" width="80%" borderWidth={1} borderRadius={8} boxShadow="lg" bg={useColorModeValue('white', 'gray.700')}>
          <Box textAlign="center">
            <Heading>Create New Account</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem colSpan={2}>
                  {/* <VStack spacing={4}> */}
                  <FormControl isRequired>
                    <FormLabel>Resume</FormLabel>
                    <Dropzone onFileAccepted={(file) => handleFileUpload(file)} />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>FirstName</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>LastName</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <FormControl>
                  <FormLabel htmlFor='education' fontSize="30px">Education</FormLabel>
                  <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>School Name</FormLabel>
                        <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Enter your school name" />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>Major</FormLabel>
                        <Input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Enter your major" />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker selected={educationStartDate} onChange={date => handleStartDateChange('education', date)} />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker selected={educationEndDate} onChange={date => handleEndDateChange('education', date)} />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  {/* <FormControl> */}
                  <FormLabel htmlFor='education' fontSize="30px" mt="5">Work Experience</FormLabel>
                  <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>Employeer Name</FormLabel>
                        <Input value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Enter your Employeer Name" />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>Position</FormLabel>
                        <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Enter your position" />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker selected={experienceStartDate} onChange={date => handleStartDateChange('work', date)} />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <FormControl isRequired>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker selected={experienceEndDate} onChange={date => handleEndDateChange('work', date)} />
                      </FormControl>
                    </GridItem>
                  </Grid>
                {/* </FormControl> */}
                <SkillsForm tags={tags} setTags={setTags} />
                </FormControl>

                <GridItem textAlign="center" colSpan={2}>
                  <Button width="20%" mt={4} type="submit" colorScheme="teal">
                    Register
                  </Button>
                </GridItem>
                {/* </VStack> */}
              </Grid>
            </form>
            {message && <Text mt={4}>{message}</Text>}
          </Box>
          <Box textAlign="center">
            <Text>Already have an account?</Text>
            <Link as={RouterLink} to="/login" color="teal.500">Login here</Link>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default RegisterPage;
