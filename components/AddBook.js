/* 
Component to add new book for the user
*/

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import DialogAddBook from './DialogAddBook';

export default function AddBook() {
    
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleAddBookClick = () => {
        setOpenAddDialog(true);
    };

    const handleAddBookClose = () => {
        setOpenAddDialog(false);
    };

    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box paddingX={"1em"}>
                    <Typography variant='subtitle' component='h2'>Add a Book</Typography>
                    <Fab 
                        data-testid="add-book-fab" 
                        color='secondary' 
                        aria-label='add book' 
                        onClick={handleAddBookClick} 
                        sx={{margin: "2em"}}
                    >
                        <AddIcon />
                    </Fab>
                    <DialogAddBook addDialogState={openAddDialog} handleClose={handleAddBookClose}/>
                </Box>
            </Paper>
        </Grid>
    );
}