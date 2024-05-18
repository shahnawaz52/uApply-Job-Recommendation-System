import { Box, Button, Flex, Input, Text, VStack, Icon, Heading, Tag, Link, CircularProgress, useColorMode  } from "@chakra-ui/react";
import { FaBookmark } from 'react-icons/fa';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from "react";
import axios from "axios";
import CreatableSelect from 'react-select/creatable';
import { cities } from "./filterOptions";

const JobCard = ({ jobInfo, savedJobIds, setSavedJobIds }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isSaved = savedJobIds.includes(jobInfo.job_id);

  const toggleDescription = () => setDescriptionExpanded(!isDescriptionExpanded);

  const truncateDescription = (description, wordLimit = 20) => {
    const div = document.createElement("div");
    div.innerHTML = description;
    const text = div.textContent || div.innerText || "";
    return text.split(' ').slice(0, wordLimit).join(' ') + '...';
  };

  const handleSaveJob = async (jobId) => {
    setIsSaving(true);
    try {
      const response = await axios.post('http://localhost:5000/save-jobs', { job_id: jobId }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (!isSaved) {
        setSavedJobIds(prev => [...prev, jobId]);
      }
      console.log("Job saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving job:", error);
    }
    setIsSaving(false);
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')
      }-${date.getDate().toString().padStart(2, '0')
      }-${date.getFullYear()
      }`;
  }

  function formatSalary(salaryInfo) {
    if (!salaryInfo || salaryInfo.min_salary == null || salaryInfo.max_salary == null) {
      return "";
    }
    const { min_salary, max_salary, salary_type } = salaryInfo;
    const formattedType = salary_type === 'yearly' ? 'yearly' : salary_type;
    return `$${min_salary.toLocaleString()}/${formattedType} - $${max_salary.toLocaleString()}/${formattedType}`;
  }
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" m="4" width="90%" position="relative" boxShadow="md">
      <Flex position="absolute" top="4" right="4" alignItems="center" gap="2">
        <Button
          leftIcon={<FaBookmark />}
          colorScheme={isSaved ? "green" : "blue"}
          variant={isSaved ? "solid" : "outline"}
          size="sm"
          onClick={() => handleSaveJob(jobInfo.id)}
          isLoading={isSaving}
          loadingText="Saving"
        >
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button colorScheme="blue" size="sm" as={Link} href={jobInfo.application_url} target="_blank">
          Apply <Icon as={ExternalLinkIcon} ml="1" />
        </Button>
      </Flex>
      <VStack align="start" mb="2">
        <Flex>
          <Heading size="md" mb="1">{jobInfo.title}</Heading>
          <span style={{ marginLeft: '16px' }}>({formatDate(jobInfo.publication_time)})</span>
        </Flex>
        <Flex align="center" mb="1">
          <Heading size="sm" mr="2">{jobInfo.company_name}</Heading>
          <Text ml="1">{jobInfo.location}</Text>
          <Tag size="md" variant="solid" colorScheme="green" ml={2}>
            {jobInfo.employment_hour_type}
          </Tag>
        </Flex>
        <Flex>
          {formatSalary(jobInfo.salary)}
        </Flex>
        {/* <Box>
          <Text>{jobInfo.salary && (<><FaBookmark /> {jobInfo.salary}</>)}</Text>
        </Box> */}
        <Box>
          {isDescriptionExpanded ? (
            <>
              {/* <div dangerouslySetInnerHTML={sanitizeHtml(jobInfo.html_description)} /> */}
              <div dangerouslySetInnerHTML={{ __html: jobInfo.html_description }} />
              <Button variant="link" onClick={toggleDescription} size="sm">View Less..</Button>
            </>
          ) : (
            <>
              <Text display="inline">{truncateDescription(jobInfo.html_description)}</Text>
              <Button variant="link" onClick={toggleDescription} size="sm" display="inline">View More..</Button>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

const JobsPage = () => {
  const { colorMode } = useColorMode();
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchJobs = async () => {
    const options = {
      method: 'GET',
      url: 'https://job-search-api1.p.rapidapi.com/v1/job-description-search',
      params: {
        q: query,
        page: '1',
        country: 'us',
        // city: 'Seattle'
        city: selectedCity ? selectedCity.value : ''
      },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'job-search-api1.p.rapidapi.com'
      }
    };

    setIsJobLoading(true);
    try {
      const response = await axios.request(options);
      console.log("API response:", response.data);
      if (response.data && response.data.jobs) {
        setJobs(response.data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setIsJobLoading(false);
    }
  };

  
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
    <VStack spacing={4}>
      <Flex width="100%" justify="center">
      <Input
          placeholder="Enter job title, e.g., Software Engineer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          width="70%"
          borderWidth="2px" 
          borderRadius="lg"
          ml={8}
        />
        <Box ml={4} width="30%">
          <CreatableSelect
            placeholder="Type or Select City"
            styles={customStyles}
            textAlign="left"
            options={cities}
            onChange={setSelectedCity}
            value={selectedCity}
          />
        </Box>
        </Flex>
      <Button
        colorScheme="blue"
        onClick={fetchJobs}
        isLoading={isJobLoading}
        disabled={isJobLoading}
      >
        {isJobLoading ? (
          <CircularProgress isIndeterminate size="24px" color="teal" />
        ) : (
          "Search Jobs"
        )}
      </Button>
      {jobs.map((job, index) => (
        <JobCard key={index} jobInfo={job} savedJobIds={savedJobIds} setSavedJobIds={setSavedJobIds} />
      ))}
    </VStack>
  );
};

export default JobsPage;
