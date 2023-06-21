import React from 'react';
import { Typography, Button } from '@mui/material';
import styles from '../styles/dashboard.module.scss';
import Head from 'next/head';

const Dashboard = ({ userEmail, onSignOut }) => {
  return (
    <div>
        <Head>Bookeeper</Head>
      <div className={styles.ribbon}>
        <Typography variant="subtitle1">{userEmail}</Typography>
        <Button variant="contained" color="secondary" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>
      <div>
        <Button variant='contained' color='secondary'>Book</Button>
      </div>
    </div>
  );
};

export default Dashboard;
