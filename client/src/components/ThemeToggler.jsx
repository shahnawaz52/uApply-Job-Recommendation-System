import React from 'react'
import { useColorMode, Box, IconButton, Flex, Image } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export default function ThemeToggler() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex justifyContent="space-between" alignItems="center" p={4} py={2}>
      <Box>
        <Image src="/uApply.png" alt="uApply Logo" boxSize="70px" />
      </Box>
      <Box textAlign="right" py={4} >
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
        {/* <h2>Toggle Theme</h2> */}
      </Box>
    </Flex>
  );
}