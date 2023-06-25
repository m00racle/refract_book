import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import NavBar from '../components/navbar';
import BookCard from '../components/bookcard';
import AddBook from '../components/AddBook';

const Dashboard = ({ userEmail, onSignOut }) => {
  return (
    <>
      <Head><title>Dashboard</title></Head>

      <NavBar />
      <Container>
        <Typography component='h2'
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
              lg: '3rem',
            },
          }}
        >
          List of Books
        </Typography>
        <Grid container spacing={3}>
          <BookCard />
          <BookCard />
          <AddBook />
        </Grid>
      </Container>
      
    </>
  );
};

export default Dashboard;
