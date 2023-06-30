/*  
The navigation bar used when accessing the book page.
*/

import { AppBar, Container, Toolbar, Typography } from "@mui/material";


export default function BookNavBar({ bookId }) {
    // navigation bar for specific book

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* let's skip the logo for now */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href={`/book/${bookId}`}
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
                        BOOK {bookId}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}