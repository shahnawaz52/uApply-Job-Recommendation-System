import React from 'react';
import { Button, Flex } from '@chakra-ui/react';

const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Flex justify="center" align="center" mt="4">
      {pageNumbers.map(number => (
        <Button 
          key={number} 
          onClick={() => paginate(number)}
          colorScheme={currentPage === number ? "blue" : "gray"}
          mr="2"
        >
          {number}
        </Button>
      ))}
    </Flex>
  );
};

export default Pagination;
