/* 
Component to add new book for the user
*/

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import ModalAddBook from './ModalAddBook';

export default function AddBook() {
    const [openModal, setOpenModal] = useState(false);
    const [modalState, setModalState] = useState('');

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddBookClick = () => {
        setModalState('Add new book');
        handleOpenModal();
    };

    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box paddingX={"1em"}>
                    <Typography variant='subtitle' component='h2'>Add a Book</Typography>
                    <Button variant='contained' sx={{margin:'1em'}} onClick={handleAddBookClick}><AddCircleOutlineIcon sx={{width: '1em'}}/></Button>
                    <ModalAddBook open={openModal} onClose={handleCloseModal} modalState={modalState} />
                </Box>
            </Paper>
        </Grid>
    );
}