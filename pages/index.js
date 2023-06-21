import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { Button } from '@mui/material';
import styles from '../styles/landing.module.scss';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Bookeeper</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Welcome to Bookeeper!</Typography>
          <Typography variant="h2">Simple Accounting App</Typography>
          <div className={styles.buttons}>
            <Button variant="contained" color="secondary">
              Login / Register
            </Button>
          </div>
        </Container>
      </main>
    </div>);
}
