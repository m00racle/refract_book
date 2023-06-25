import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Button, Typography } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function BookCard() {
    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box display="flex" justifyContent="space-between">
                    <Typography variant='subtitle' component='h2'>Book1</Typography>
                    <Box>
                        <Button variant='contained' xs={{ margin:"2em"}}><ModeEditOutlineIcon/></Button>
                        <Button variant='contained' xs={{ margin:"5em"}}><DeleteForeverIcon /></Button>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
}