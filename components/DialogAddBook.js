import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, Switch } from '@mui/material';

export default function DialogAddBook({ addDialogState, handleClose }) {
    // build dialog when user click add book button
    
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [switchedOffEmail, setSwitchedOffEmail] = useState(false); //<-- TODO: change the switchOffEmail to switchOnEmail
    const [emailEnabled, setEmailEnabled] = useState(true);

    // TODO: make handle local close to make the switch back to off and clear the email address

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    // TODO: input text field address?

    // TODO: input drop down industry type

    // TODO: input text field NPWP

    const handleSwitcedEmailChange = (event) => {
        setSwitchedOffEmail(event.target.checked);
        if (!switchedOffEmail) { //<-- TODO: change to switchOnEmail
            setEmail('default@gmail.com');
            // TODO: change this later to user email from database
            setEmailEnabled(false)
        } else {
            setEmail('');
            setEmailEnabled(true);
        }
    };

    const handleEmailChange = (event) => {
        // TODO: add check box whether the book use user email instead.
        setEmail(event.target.value);
    };

    // TODO: validate all inputs

    const handleSubmit = () => {
        // TODO: change this to the process of adding book to database
        console.log(name);
        console.log(email);
        setName('')
        setEmail('');
        handleClose();
        setEmailEnabled(true);
        setSwitchedOffEmail(false);
    };

    return (
        <div>
            <Dialog open={addDialogState} onClose={handleClose}>
                <DialogTitle>Add New Book</DialogTitle>
                
                <DialogContent>
                    <DialogContentText>
                        Provide the data for the new book
                    </DialogContentText>
                    <TextField 
                        autoFocus
                        margin='dense'
                        id='bookname'
                        label="Book Name"
                        type='text'
                        fullWidth
                        variant='standard'
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField 
                        margin='dense'
                        id='useremail'
                        label="Email Address"
                        type='email'
                        fullWidth
                        variant='standard'
                        value={email}
                        onChange={handleEmailChange}
                        disabled={!emailEnabled}
                    />
                    <FormControlLabel label="use user email" control={<Switch onChange={handleSwitcedEmailChange}/>} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}