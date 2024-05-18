import React, { useState } from 'react';
import LogoutPage from './LogoutPage';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Button,
  VStack,
  Input,
  useColorModeValue
} from '@chakra-ui/react';

const options = [
  'Higher Education',
  'Information Technology & Services',
  'Accounting',
  'Electrical & Electronic Manufacturing',
  // Add more options here
];

// const HomePage = () => {
//   return (
//     <div style={{ position: 'relative' }}>
//       <h1>Welcome to the Home Page</h1>
//       <div style={{ position: 'absolute', top: 10, right: 10 }}>
//         <LogoutPage />
//       </div>
//     </div>
//   );
// };

// export default HomePage;


const HomePage = () => {
  const [jobType, setJobType] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [specialityType, setSpecialityType] = useState('');
  const [resume, setResume] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Job Type:', jobType);
    console.log('Industry Type:', industryType);
    console.log('Speciality Type:', specialityType);
  };

  return (
    <div>
    <LogoutPage/>
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={useColorModeValue('gray.50', 'gray.800')}>
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" bg={useColorModeValue('white', 'gray.700')}>
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="jobType">
            <FormLabel>What type of jobs are you looking for?</FormLabel>
            <Select
              placeholder="Select job type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>


          {/* <FormControl id="industryType">
            <FormLabel>What type of industry are you looking for?</FormLabel>
            <Select
              placeholder="Select industry type"
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
            >
              <option value="industry1">Industry 1</option>
              <option value="industry2">Industry 2</option>
              <option value="industry3">Industry 3</option>
            </Select>
          </FormControl> */}
            {/* <FormControl id="industryType">
            <FormLabel>What type of industry are you looking for?</FormLabel>
            <Autocomplete
              value={industryType}
              onChange={(event, newValue) => {
                setIndustryType(newValue);
              }}
              options={options}
              renderInput={(params) => <TextField {...params} label="Select industry type" />}
            />
          </FormControl> */}

          <FormControl id="specialityType">
            <FormLabel>What type of speciality are you looking for?</FormLabel>
            <Select
              placeholder="Select speciality type"
              value={specialityType}
              onChange={(e) => setSpecialityType(e.target.value)}
            >
              <option value="speciality1">Speciality 1</option>
              <option value="speciality2">Speciality 2</option>
              <option value="speciality3">Speciality 3</option>
            </Select>
          </FormControl>

          <FormControl id="resume">
            <FormLabel>Upload a resume</FormLabel>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </FormControl>

          <Button colorScheme="teal" type="submit">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
    </Box>
    </Box>
    </div>
  );
};

export default HomePage;
