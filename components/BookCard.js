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
                    <Typography variant='subtitle' component='h2' marginLeft={"1em"}>Book1</Typography>
                    <Box>
                        <Button sx={{ bgcolor: 'background.paper'}}><ModeEditOutlineIcon/></Button>
                        <Button variant='contained'><DeleteForeverIcon /></Button>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
}