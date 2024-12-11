import React from 'react';
import styles from './Home.module.css';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg" className={styles.homeContainer}>
      <Box className={styles.homeContent}>
        <Typography variant="h2" gutterBottom>Welcome to theCut Barbershop</Typography>
        <Typography variant="h5" gutterBottom>
          Transform your look with our expert stylists. Book your appointment today and experience the ultimate grooming service!
        </Typography>
        <Button variant="contained" component={RouterLink} to="/booking" className={styles.homeButton}>
          Book Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
