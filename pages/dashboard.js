import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import Head from 'next/head';
import NavBar from '../components/navbar';
import BookCard from '../components/bookcard';

const Dashboard = ({ userEmail, onSignOut }) => {
  return (
    <>
      <Head><title>Dashboard</title></Head>

      <NavBar />
      <Container>
        <Grid container spacing={3}>
          <BookCard />
          <BookCard />
        </Grid>
      </Container>
      
    </>
  );
};

export default Dashboard;
