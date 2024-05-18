import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, VStack, Button, useColorModeValue, HStack, Icon } from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi'; // Generic file icon

const Dropzone = ({ onFileAccepted }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'application/pdf',
    // noClick: true,
    // noKeyboard: true,
    onDropAccepted: (acceptedFiles) => {
      setUploadedFile(acceptedFiles[0]);
      onFileAccepted(acceptedFiles[0]);
    },
  });

  return (
    <Box
      {...getRootProps()}
      cursor="pointer"
      bg={useColorModeValue('gray.50', 'gray.800')}
      borderRadius="md"
      p={5}
      textAlign="center"
      border="2px dashed"
      borderColor={useColorModeValue('gray.300', 'gray.600')}
    >
      <input {...getInputProps()} />
      {!uploadedFile ? (
        <VStack spacing={2}>
          <Text>Drag 'n' drop resume here, or click to select resume</Text>
          <Button colorScheme="teal" onClick={open}>
            Choose File
          </Button>
        </VStack>
      ) : (
        <HStack spacing={2} justifyContent="center">
          <Icon as={FiFileText} w={6} h={6} /> {/* File icon */}
          <Text>{uploadedFile.name}</Text> {/* Display the file name */}
        </HStack>
      )}
    </Box>
  );
};

export default Dropzone;