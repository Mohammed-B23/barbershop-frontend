import React from 'react';
import styled from '@emotion/styled';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  text-align: center;
`;

const Header: React.FC = () => {
  return (
    <StyledAppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            theCut Barbershop
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/booking">Book New Appointment</Button>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
