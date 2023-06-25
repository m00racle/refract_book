/* 
Component to add new book for the user
*/

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Button, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddBook() {
    return (
        <Grid item xs={4}>
            <Paper elevation={3} >
                <Box paddingX={"1em"}>
                    <Typography variant='subtitle' component='h2'>Add a Book</Typography>
                    <Button variant='contained' sx={{margin:'1em'}}><AddCircleOutlineIcon sx={{width: '1em'}}/></Button>
                </Box>
            </Paper>
        </Grid>
    );
}