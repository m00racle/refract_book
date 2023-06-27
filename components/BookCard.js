import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Button, Stack, Typography } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Fab from '@mui/material/Fab';

export default function BookCard() {
    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box display="flex" justifyContent="space-between">
                    <Typography variant='subtitle' component='h2' marginLeft={"1em"}>Book1</Typography>
                    <Stack direction="row" spacing={"0.5em"}>
                        
                        <Fab color='primary' aria-label='edit book' ><ModeEditOutlineIcon /></Fab>
                        
                        <Fab color='secondary' aria-label='delete book' ><DeleteForeverIcon /></Fab>
                    </Stack>
                </Box>
            </Paper>
        </Grid>
    );
}