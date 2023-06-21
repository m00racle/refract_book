import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Link from '../src/Link';
import Copyright from '../src/Copyright';

export default function Home() {
  return (
    <Box>
        <Typography variant='h1' component='p'>Let's gone with h1</Typography>
        <Copyright />
    </Box>
  );
}
