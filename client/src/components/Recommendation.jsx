import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Tag, Heading, Flex, VStack, HStack, Text, Button, Link, Input, Icon, CircularProgress, useColorMode } from '@chakra-ui/react';
import { FaMapMarkerAlt as LocationIcon, FaBookmark, FaUniversity, FaUser } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import Select from 'react-select';
import { employmentTypes, usStates, companyIndustries } from './filterOptions';

const JobCard = ({ jobInfo, savedJobIds, setSavedJobIds }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // const [savedJobIds, setSavedJobIds] = useState([]);
  const isSaved = savedJobIds.includes(jobInfo[1].job_id);

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  function formatJobDescription(description) {
    // Keywords to highlight and structure the content more effectively
    const keywords = ['MUST', 'Preferred', 'Customer ask'];
    const lines = description.split('\n'); // Splitting by new lines to handle different parts

    return lines.map((line, idx) => {
      const keywordFound = keywords.find(keyword => line.includes(keyword));

      if (keywordFound) {
        // Highlight "MUST" and "Preferred" keywords and list their requirements
        if (['MUST', 'Preferred'].includes(keywordFound)) {
          return (
            <React.Fragment key={idx}>
              <Text as="div" mb={2} fontWeight="bold">
                {line}
              </Text>
              <ul>
                {line.split(keywordFound)[1].split(',').map((item, itemIdx) => (
                  <li key={itemIdx}><Text>{item.trim()}</Text></li>
                ))}
              </ul>
            </React.Fragment>
          );
        }
        // Special handling for "Customer ask" as a section
        if (keywordFound === 'Customer ask') {
          return (
            <Box key={idx} mt={4} mb={2}>
              <Text as="div" fontWeight="bold" textDecoration="underline">{line}</Text>
            </Box>
          );
        }
      }
      // Default text rendering for lines without specific keywords
      return <Text key={idx} mt={2}>{line}</Text>;
    });
  }

  function formatJobDescription(description) {
    const lines = description.split('\n'); // Splitting by new lines

    return (
      <Box>
        {lines.map((line, idx) => {
          // Check for bullet points
          if (line.trim().startsWith('●')) {
            return (
              <Text as="div" key={idx} mb="2">
                <ul>
                  <li>{line.replace('●', '').trim()}</li>
                  <li>{line.replace('•', '').trim()}</li>
                </ul>
              </Text>
            );
          }
          return <Text key={idx} mb="2">{line}</Text>;
        })}
      </Box>
    );
  }

  const truncateDescription = (description, wordLimit = 20) => {
    const div = document.createElement("div");
    div.innerHTML = description;
    const text = div.textContent || div.innerText || "";
    return text.split(' ').slice(0, wordLimit).join(' ') + '...';
  };

  const handleSaveJob = async (jobId) => {
    const currentlySaved = savedJobIds.includes(jobId);

    if (!currentlySaved) {
      setIsSaving(true); // Only set loading when saving a job
    }
    try {
      if (currentlySaved) {
        // Unsave job if it is already saved
        await axios.delete('http://localhost:5000/unsave-jobs', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          data: { job_id: jobId } // Axios DELETE with body requires using 'data'
        });
        // Remove from saved jobs in state
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      } else {
        // Save job if it is not saved
        const response = await axios.post('http://localhost:5000/save-jobs', { job_id: jobId }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("Job saved successfully:", response.data);
        setSavedJobIds(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Error saving job:", error.response || error);
    } finally {
      if (!currentlySaved) {
        setIsSaving(false); // Only clear loading when saving was initiated
      }
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" m="4" width="90%" position="relative" boxShadow="md">
      <Flex position="absolute" top="4" right="4" alignItems="center" gap="2">
        <Button
          leftIcon={<FaBookmark />}
          colorScheme={isSaved ? "green" : "blue"} // Change button color if saved
          variant={isSaved ? "solid" : "outline"}
          size="sm"
          onClick={() => handleSaveJob(jobInfo[1].job_id)}
          isLoading={isSaving && !isSaved}
          loadingText="Saving"
        >
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button colorScheme="blue" size="sm" as={Link} href={jobInfo[1].linkedin_url} target="_blank">
          Apply <Icon as={ExternalLinkIcon} ml="1" />
        </Button>
      </Flex>
      <VStack align="start" mb="2">
        <Heading size="md" mb="1">{jobInfo[1].title}</Heading>

        <Flex align="center" mb="1">
          <Heading size="sm" mr="2">{jobInfo[1].company_name}</Heading>
          <LocationIcon />
          <Text ml="1">{jobInfo[1].location}</Text>
          <Tag size="md" variant="solid" colorScheme="green" ml={2}>
            {jobInfo[1].formatted_work_type}
          </Tag>
        </Flex>
        <Box>
          {/* <p>   {jobInfo[1].salary && (
            <>
              <BriefcaseIcon /> {jobInfo[1].salary}
            </>
          )}</p> */}
        </Box>
        <Box>
          {isDescriptionExpanded ? (
            <>
              {formatJobDescription(jobInfo[1].description)}
              {/* {jobInfo[1].company_description} */}
              {/* <RawHTML html={jobInfo[1].company_description} /> */}
              {/* {parse(jobInfo[1].description)} */}
              <Button variant="link" onClick={toggleDescription} size="sm">
                View Less..
              </Button>
            </>
          ) : (
            <>
              <Text display="inline">{truncateDescription(jobInfo[1].description)}</Text>
              <Button variant="link" onClick={toggleDescription} size="sm" display="inline">
                View More..
              </Button>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

const StudentCard = ({ studentInfo }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" m="2" width="100%" position="relative" boxShadow="md">
      <Flex position="absolute" top="4" right="4" alignItems="center" gap="2">
        <Button colorScheme="blue" size="xs" as={Link} href={studentInfo.company_link} target="_blank">
          Apply <Icon as={ExternalLinkIcon} ml="1" />
        </Button>
      </Flex>
      <VStack align="start" mb="2">
        <Heading size="sm" mb="1">{studentInfo.position}</Heading>
        <Flex align="center" mb="1">
          <Heading size="xs" mr="2">{studentInfo.company_name}</Heading>
        </Flex>
        <Flex align="center" mb="1">
          <LocationIcon />
          <Text ml="1">{studentInfo.company_address}</Text>
        </Flex>
        <Flex align="center" mb="1">
          <FaUniversity />
          <Text ml="2">{studentInfo.education}</Text>
        </Flex>
        <Flex align="center" mb="1">
          <FaUser />
          <Text ml="2">
            Your University student{' '}
            <Link
              color="blue.500"
              href={studentInfo.linkedin}
              isExternal
              _hover={{ textDecoration: 'underline', color: 'blue.300' }}
              fontWeight="bold"
            >
              {studentInfo.full_name}
            </Link>{' '}
            works here
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

const RecommendationPage = () => {
  const [filters, setFilters] = useState({ location: '', employmentType: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const firstname = localStorage.getItem('fname');
  const lastname = localStorage.getItem('lname');
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Pagination states for Jobs
  const [currentPageJobs, setCurrentPageJobs] = useState(1);
  const [jobsPerPage] = useState(10); // Adjust as needed

  // Pagination states for Students
  const [currentPageStudents, setCurrentPageStudents] = useState(1);
  const [studentsPerPage] = useState(10); // Adjust as needed

  const [savedJobIds, setSavedJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);


  useEffect(() => {
    const fetchRecommendationsAndSavedJobs = async () => {
      setIsLoading(true);

      try {
        // Fetch recommendations based on user details
        const recResponse = await axios.post('http://localhost:5000/recommendation', {
          firstname,
          lastname
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (recResponse.data && recResponse.data.jobs && recResponse.data.students) {
          setJobs(recResponse.data.jobs);
          setStudents(recResponse.data.students);
          const uniqueIndustries = new Set(recResponse.data.jobs.map(job => job.industry));
          setIndustries([...uniqueIndustries]);
        }

        // Fetch saved job IDs
        const savedJobsResponse = await axios.get('http://localhost:5000/get-saved-jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const savedIds = savedJobsResponse.data.map(job => job.job_id);
        setSavedJobIds(savedIds);

      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          // Redirect to login if unauthorized
          navigate('/login');
        }
      }

      setIsLoading(false);
    };

    fetchRecommendationsAndSavedJobs();
  }, [firstname, lastname, navigate]);

  // useEffect(() => {
  //   const fetchRecommendationsAndSavedJobs = async () => {
  //     setIsLoading(true);

  //     try {
  //       // Use Promise.all to make parallel API calls
  //       const [recResponse, savedJobsResponse] = await Promise.all([
  //         axios.post('http://localhost:5000/recommendation', {
  //           firstname,
  //           lastname
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`
  //           }
  //         }),

  //         axios.get('http://localhost:5000/get-saved-jobs', {
  //           headers: { 
  //             Authorization: `Bearer ${localStorage.getItem('token')}` 
  //           }
  //         })
  //       ]);

  //       // Handle recommendations response
  //       if (recResponse.data && recResponse.data.jobs && recResponse.data.students) {
  //         setJobs(recResponse.data.jobs);
  //         setStudents(recResponse.data.students);
  //         const uniqueIndustries = new Set(recResponse.data.jobs.map(job => job.industry));
  //         setIndustries([...uniqueIndustries]);
  //       }

  //       // Handle saved jobs response
  //       const savedIds = savedJobsResponse.data.map(job => job.job_id);
  //       setSavedJobIds(savedIds);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       if (error.response && error.response.status === 401) {
  //         navigate('/login');  // Redirect to login if unauthorized
  //       }
  //     }

  //     setIsLoading(false);
  //   };

  //   fetchRecommendationsAndSavedJobs();
  // }, [firstname, lastname, navigate]);


  const handleFilterChange = (key, value) => {
    console.log(key, value)
    setFilters({ ...filters, [key]: value });
  };

  const handleIndustrySearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilters({ ...filters, industry: searchTerm });
  };

  // Jobs Pagination
  const indexOfLastJob = currentPageJobs * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const filteredJobs = Object.entries(jobs).filter(job => {
    return (!filters.location || job[1].location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.employmentType || job[1].formatted_work_type === filters.employmentType) &&
      (!filters.companyIndustries || job[1].company_industry.toLowerCase().includes(filters.companyIndustries.toLowerCase()));
  });
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Students Pagination
  const indexOfLastStudent = currentPageStudents * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page functions
  const paginateJobs = (pageNumber) => setCurrentPageJobs(pageNumber);
  const paginateStudents = (pageNumber) => setCurrentPageStudents(pageNumber);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: colorMode === 'dark' ? '#2D3748' : '#fff',
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
      borderColor: state.isFocused ? (colorMode === 'dark' ? '#E2E8F0' : '#2D3748') : base.borderColor,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: colorMode === 'dark' ? '#2D3748' : '#fff',
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
    }),
    singleValue: (base) => ({
      ...base,
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
    }),
    placeholder: (base) => ({
      ...base,
      color: colorMode === 'dark' ? '#A0AEC0' : '#A0AEC0',
    }),
  };


  return (
    <VStack spacing={4} align="stretch">
      {/* Filters Section */}
      <Flex width="full" p="4" boxShadow="md" align="center" justify="space-between">
        <HStack spacing={4} flexGrow={1}>
        <Box width="250px" textAlign="left">
          <Select
            placeholder="Location"
            styles={customStyles}
            options={[{ value: '', label: 'All Locations' }, ...usStates]}
            onChange={selectedOption => handleFilterChange('location', selectedOption ? selectedOption.value : '')}
            maxW="300px"
          />
          </Box>
          <Box width="250px" textAlign="left">
          <Select
            placeholder="Employment Type"
            styles={customStyles}
            options={[{ value: '', label: 'All Employment Types' }, ...employmentTypes]}
            onChange={selectedOption => handleFilterChange('employmentType', selectedOption ? selectedOption.value : '')}
            maxW="300px"
          />
          </Box>
          <Box width="250px" textAlign="left">
          <Select
            placeholder="Company Industry"
            styles={customStyles}
            options={[{ value: '', label: 'All Industries' }, ...companyIndustries]}
            onChange={selectedOption => handleFilterChange('companyIndustries', selectedOption ? selectedOption.value : '')}
            maxW="300px"
          />
          </Box>
        </HStack>
      </Flex>

      {/* Main Content Section */}
      <Flex direction={["column", "row"]} align="flex-start" justify="center" w="full">
        {/* Job Cards Section */}
        <Box w={["full", "60%"]} p="4" overflowY="auto" maxH="calc(100vh - 80px)">
          {isLoading ? (
            <Flex justify="center" align="center" h="100%">
              <CircularProgress isIndeterminate color="blue.500" />
            </Flex>
          ) : (
            <VStack spacing={4} align="stretch">
              <Heading as="h1" size="lg" mb="4" align="left">Top job picks for you</Heading>
              {currentJobs.map((jobInfo, index) => (
                <JobCard key={index} jobInfo={jobInfo} savedJobIds={savedJobIds} setSavedJobIds={setSavedJobIds} />
              ))}
              <Pagination jobsPerPage={jobsPerPage} totalJobs={filteredJobs.length} paginate={paginateJobs} currentPage={currentPageJobs} />
            </VStack>
          )}
        </Box>

        {/* Students Section */}
        <Box w={["full", "40%"]} p="4" overflowY="auto" maxH="calc(100vh - 80px)" ml="4">
          {isLoading ? (
            <Flex justify="center" align="center" h="100%">
              <CircularProgress isIndeterminate color="blue.500" />
            </Flex>
          ) : (
            <VStack spacing={4} align="stretch">
              <Heading as="h4" size="md" mb="4" align="left">You also might like</Heading>
              {currentStudents.map((studentInfo, index) => (
                <StudentCard key={index} studentInfo={studentInfo} />
              ))}
              <Pagination jobsPerPage={studentsPerPage} totalJobs={students.length} paginate={paginateStudents} currentPage={currentPageStudents} />
            </VStack>
          )}
        </Box>
      </Flex>
    </VStack>
  );
};

export default RecommendationPage;
