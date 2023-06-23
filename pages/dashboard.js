import React from 'react';
import { Typography, Button } from '@mui/material';
import styles from '../styles/dashboard.module.scss';
import Head from 'next/head';
import NavBar from '../components/navbar';

const Dashboard = ({ userEmail, onSignOut }) => {
  return (
    <div>
      <Head><title>Bookeeper</title></Head>

      <NavBar />
      <div>
        <Button variant='contained' color='secondary'>Book</Button>
      </div>
    </div>
  );
};

export default Dashboard;
