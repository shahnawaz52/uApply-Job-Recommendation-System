import React, { useEffect } from 'react';
import {
  Box, FormControl, FormLabel, Input, Button, VStack, useColorModeValue,
  Heading, useToast, Grid,
  GridItem, Tag, TagLabel
} from '@chakra-ui/react';
import axios from 'axios';

// import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, useColorModeValue } from '@chakra-ui/react';

const InfoCard = ({ title, children }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      minWidth="600px"
      width="80%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg={cardBg}
      boxShadow="xl"
      border="1px"
      borderColor={borderColor}
      m="auto"
      mt={6}
    >
      <Heading as="h3" size="lg" textAlign="left" mb={4}>{title}</Heading>
      {children}
    </Box>
  );
};


function AccountInfoForm() {
  const toast = useToast();

  const [accountInfo, setAccountInfo] = React.useState({
    firstname: '',
    lastname: '',
    resume: '',
    education: {},
    work_experience: {},
    // schoolName: '',
    // major: '',
    // employerName: '',
    // position: '',
    tags: [],
  });



  // Fetch account info on component mount
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/account', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAccountInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch account info', error);
      }
    };
    fetchAccountInfo();
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAccountInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/user/update', accountInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast({
        title: "Account updated.",
        description: "Your account information has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to update account info', error);
      toast({
        title: "Update failed.",
        description: "Failed to update account information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <InfoCard title="Account Info">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input name="firstname" value={accountInfo.firstname} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input name="lastname" value={accountInfo.lastname} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
        </Grid>
      </InfoCard>


      <InfoCard title="Education">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>School Name</FormLabel>
              <Input name="schoolName" value={accountInfo.education.schoolName} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Major</FormLabel>
              <Input name="major" value={accountInfo.education.major} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
          {/* Include DatePicker components for dates */}
        </Grid>
      </InfoCard>

      <InfoCard title="Work Experience">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Employer Name</FormLabel>
              <Input name="employerName" value={accountInfo.work_experience.employerName} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>Position</FormLabel>
              <Input name="position" value={accountInfo.work_experience.position} onChange={handleInputChange} />
            </FormControl>
          </GridItem>
          {/* Include DatePicker components for dates */}
        </Grid>
      </InfoCard>

      <InfoCard title="Skills">
        {/* Skills form logic here */}
        <Box display="flex" flexWrap="wrap" mb={2}>
          {accountInfo.tags.map((tag, index) => (
            <Tag size="lg" key={index} borderRadius="full" variant="solid" colorScheme="green" m={1}>
              <TagLabel>{tag}</TagLabel>
              {/* <TagCloseButton onClick={() => removeTag(index)} /> */}
            </Tag>
          ))}
        </Box>
      </InfoCard>
      <GridItem textAlign="center" colSpan={2}>
        <Button mt={4} colorScheme="blue" type="submit" width="20%">Update Info</Button>
      </GridItem>

    </VStack>
  );
}

export default AccountInfoForm;
