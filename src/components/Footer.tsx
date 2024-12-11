import React from 'react';
import styled from '@emotion/styled';
import { Box, Typography, Container, Link } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const StyledFooter = styled(Box)`
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
  width: 100%;
  position: fixed;
  bottom: 0;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Container>
        <Typography variant="body1" align="center">
          &copy; 2024 theCut Barbershop
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Link href="https://www.linkedin.com/in/mohammed-boussetta-077424267/?locale=fr_FR" color="inherit" sx={{ mx: 1 }}><Facebook /></Link>
          <Link href="https://www.linkedin.com/in/mohammed-boussetta-077424267/" color="inherit" sx={{ mx: 1 }}><LinkedInIcon /></Link>
          <Link href="https://www.linkedin.com/in/mohammed-boussetta-077424267/" color="inherit" sx={{ mx: 1 }}><Instagram /></Link>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
