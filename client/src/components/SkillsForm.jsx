import React, { useState } from 'react';
import { Box, Tag, TagLabel, TagCloseButton, Input, InputGroup, InputRightElement, IconButton, FormControl, FormLabel } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const SkillsForm = ({ tags, setTags }) => {
    // const [tags, setTags] = useState([]);
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input) { // Trigger on Enter
            e.preventDefault();
            if (!tags.includes(input.trim())) { // Avoid duplicate tags
                setTags([...tags, input.trim()]);
                setInput(''); // Clear input after adding tag
            }
        }
    };

    const removeTag = (index) => {
        setTags(tags.filter((tag, i) => i !== index));
    };

    const addTag = () => {
        if (input && !tags.includes(input.trim())) {
            setTags([...tags, input.trim()]);
            setInput('');
        }
    };

    return (
        <FormControl>
            <FormLabel fontSize="30px" mt="5">Skills</FormLabel>
            <Box display="flex" flexWrap="wrap" mb={2}>
                {tags.map((tag, index) => (
                    <Tag size="lg" key={index} borderRadius="full" variant="solid" colorScheme="blue" m={1}>
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => removeTag(index)} />
                    </Tag>
                ))}
            </Box>
            <InputGroup>
                <Input
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tags"
                />
                <InputRightElement children={<IconButton icon={<AddIcon />} size="sm" onClick={addTag} />} />
            </InputGroup>
        </FormControl>
    );
};

export default SkillsForm;
