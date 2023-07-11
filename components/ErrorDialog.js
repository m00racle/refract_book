/*  
Error dialog for displaying error?
*/
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ErrorDialog ({ open, onClose, errorMessage }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <p>{errorMessage}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}