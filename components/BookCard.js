import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Fab from '@mui/material/Fab';
import { useState } from 'react';

export default function BookCard({ bookId, bookData }) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleDeleteClick = () => {
        // handle when the delete FAB is clicked:
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        // handle when the delete dialog is cancelled or closed
        setOpenDeleteDialog(false);
    };

    const handleDeleteYesClick = () => {
        // handle when user click Yes sure button in delete dialog
        // TODO: change with the actual delete to the database
        console.log("delete the book");
        
        // close the dialog
        handleDeleteDialogClose();
    };

    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box display="flex" justifyContent="space-between">
                    <Typography variant='subtitle' component='h2' marginLeft={"1em"}>{bookData.name}</Typography>
                    <Stack direction="row" spacing={"0.5em"}>
                        
                        <Fab color='primary' aria-label='edit book' ><ModeEditOutlineIcon /></Fab>
                        
                        <Fab color='secondary' aria-label='delete book' onClick={handleDeleteClick}><DeleteForeverIcon /></Fab>
                        {/* Dialog for delete book confirmation */}
                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleDeleteDialogClose}
                            aria-labelledby='alert-delete-dialog-title'
                            aria-describedby='alert-delete-dialog-description'
                        >
                            <DialogTitle id="alert-delete-dialog-title">
                                {/* TODO: insert string literal of the Book name or id */}
                                {"Delete the book?"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-delete-dialog-description">
                                    This action is irreversible, Once the book is deleted you cannot restore it.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                                <Button onClick={handleDeleteYesClick}>Yes, delete</Button>
                            </DialogActions>
                        </Dialog>

                    </Stack>
                </Box>
            </Paper>
        </Grid>
    );
}