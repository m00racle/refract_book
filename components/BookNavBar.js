/*  
The navigation bar used when accessing the book page.
*/

import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from "next/router";


export default function BookNavBar({ bookData }) {
    // navigation bar for specific book
    const router = useRouter();
    const pages = ['transaction', 'document', 'contact', 'report'];
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handlePush = (target) => {
        // handle push target
        router.push(`/book/${bookData.id}/${target}`);
        handleCloseNavMenu();
    };

    const handleClickDashboard = () => {
        router.push('/dashboard');
        handleCloseNavMenu();
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* let's skip the logo for now */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href={`/book/${bookData.id}`}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                          }}
                    >
                        {/* TODO: put logo here instead of the word BOOK */}
                        <div>
                        {/* TODO: change this to if statement and option to use user own logo */}
                            <img src="/budget.png" alt="Book Logo" width={50} height={50} />
                        </div>
                        {bookData.name}
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={() => handlePush(page)}>
                            <Typography textAlign="center">{page}</Typography>
                            </MenuItem>
                        ))}
                        <MenuItem onClick={handleClickDashboard}>
                            <Typography textAlign="center">Dashboard</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={() => handlePush(page)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                        ))}
                        <Button
                            onClick={handleClickDashboard}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Dashboard
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}