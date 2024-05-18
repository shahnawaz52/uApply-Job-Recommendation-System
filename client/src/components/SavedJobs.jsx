import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Tag, Heading, Flex, VStack, Text, Button, Link, Icon, CircularProgress } from '@chakra-ui/react';
import { FaMapMarkerAlt as LocationIcon, FaBriefcase as BriefcaseIcon } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-saved-jobs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setSavedJobs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        setIsLoading(false);
      }
    };

    fetchSavedJobs();
  }, [navigate]);

  if (isLoading) {
    return <CircularProgress isIndeterminate color="blue.500" />;
  }

  if (savedJobs.length === 0) {
    return <Text>No saved jobs found.</Text>;
  }

  return (
    <Box>
      <VStack spacing={4}>
      <Heading as="h1" size="xl" mb="4">Saved Jobs</Heading>
        {savedJobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </VStack>
    </Box>
  );
};

const JobCard = ({ job }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const toggleDescription = () => setDescriptionExpanded(!isDescriptionExpanded);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" m="4" width="90%" position="relative" boxShadow="md">
      <Flex position="absolute" top="4" right="4" alignItems="center" gap="2">
        <Button colorScheme="blue" size="sm" as={Link} href={job.linkedin_url} target="_blank">
          Apply <Icon as={ExternalLinkIcon} ml="1" />
        </Button>
      </Flex>
      <VStack align="start" mb="2">
        <Heading size="md" mb="1">{job.title}</Heading>
        <Flex align="center" mb="1">
          <Heading size="sm" mr="2">{job.company_name}</Heading>
          <LocationIcon />
          <Text ml="1">{job.location}</Text>
          <Tag size="md" variant="solid" colorScheme="green" ml={2}>{job.formatted_work_type}</Tag>
        </Flex>
        <Box>
          {job.salary && (
            <><BriefcaseIcon /> {job.salary}</>
          )}
        </Box>
        <Box>
          {isDescriptionExpanded ? (
            <>
              <Text>{job.description}</Text>
              <Button variant="link" onClick={toggleDescription} size="sm">View Less..</Button>
            </>
          ) : (
            <>
              <Text noOfLines={1}>{job.description}</Text>
              <Button variant="link" onClick={toggleDescription} size="sm">View More..</Button>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default SavedJobsPage;
