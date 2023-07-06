import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../firebase/auth';

export default function NavBar() {
  const { authUser, signOut } = useAuth();
  // NOTE: took authUser.email to be displayed on nav bar
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* Menu icon temporary disabled (unused) */}
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
            {authUser?.email}
          </Typography>
          <Button variant='contained' color='secondary' onClick={signOut}>Sign Out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}