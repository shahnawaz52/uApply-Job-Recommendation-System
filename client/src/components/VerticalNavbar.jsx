import { Box, Link, VStack, Menu, MenuButton, MenuList, MenuItem, IconButton, useColorModeValue, Icon } from "@chakra-ui/react";
import { HomeIcon, UserIcon, BriefcaseIcon, DocumentIcon, BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/outline";
import { FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerticalNavbar = () => {
    const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            console.log('logout------------->>>', localStorage.getItem('token'))
            const response = await axios.post('http://localhost:5000/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            // Redirect to login page after successful logout
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error.message);
            // Handle logout error
        }
    };

    return (
        <Box h="100%" w="50px" left="0" top="0" overflowY="auto" p="1" m="2">
            <VStack spacing="4" align="center">
                { /* Iterate over your links */ }
                <Link href="/recommendation" display="flex" alignItems="left" _hover={{ bg: hoverBgColor, borderRadius: 'md' }} 
                      bg={isActive("/recommendation") ? hoverBgColor : "transparent" }
                      borderRadius={isActive("/recommendation") ? 'md' : '0'} > {/* Apply background if active */}
                    <Icon as={HomeIcon} boxSize="9" />
                </Link>
                <Link href="/jobs" display="flex" alignItems="left" _hover={{ bg: hoverBgColor, borderRadius: 'md' }}
                      bg={isActive("/jobs") ? hoverBgColor : "transparent"}
                      borderRadius={isActive("/jobs") ? 'md' : '0'} >
                    <Icon as={BriefcaseIcon} boxSize="9" />
                </Link>
                <Link href="/get-saved-jobs" display="flex" alignItems="center" _hover={{ bg: hoverBgColor, borderRadius: 'md' }}
                      bg={isActive("/get-saved-jobs") ? hoverBgColor : "transparent"}
                      borderRadius={isActive("/get-saved-jobs") ? 'md' : '0'} >
                    <Icon as={OutlineBookmarkIcon} boxSize="9" />
                </Link>
                <Link href="/user/account" display="flex" alignItems="left" _hover={{ bg: hoverBgColor, borderRadius: 'md' }}
                      bg={isActive("/user/account") ? hoverBgColor : "transparent"}
                      borderRadius={isActive("/user/account") ? 'md' : '0'}>
                    <Icon as={DocumentIcon} boxSize="9" />
                </Link>
                { /* Other links */ }
                <Menu>
                    <MenuButton as={IconButton} aria-label="User Menu" icon={<Icon as={UserIcon} boxSize="9" />} 
                    variant="unstyled" _hover={{ bg: hoverBgColor, borderRadius: 'md' }} />
                    <MenuList>
                        {localStorage.getItem('fname') && (<MenuItem>{localStorage.getItem('fname')}</MenuItem>)}
                        <hr style={{ width: '100%', borderColor: 'gray', margin: '8px 0' }} />
                        <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </VStack>
        </Box>
        
    );
}

export default VerticalNavbar;
