import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ProTip from '../src/ProTip';
import Box from '@mui/material/Box';
import Copyright from '../src/Copyright';
import Head from 'next/head';
import { Button } from '@mui/material';
import styles from '../styles/landing.module.scss';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Expense Tracker</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Welcome to Expense Tracker!</Typography>
          <Typography variant="h2">Add, view, edit, and delete expenses</Typography>
          <div className={styles.buttons}>
            <Button variant="contained" color="secondary">
              Login / Register
            </Button>
          </div>
        </Container>
      </main>
    </div>);
}
