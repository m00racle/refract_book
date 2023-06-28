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
    const [switchBookEmail, setSwitchBookEmail] = useState(false);
    const [emailFieldEnabled, setEmailFieldEnabled] = useState(true);
    const [formError, setFormError] = useState(false);

    // : make handle local close to make the switch back to off and clear the email address

    const resetAddBookForm = () => {
        // reset all fields in the addBook dialog content
        setName('');
        setEmail('');
        setEmailFieldEnabled(true);
        setSwitchBookEmail(false);
        setFormError(false);
        handleClose();
    };

    // validate
    
    const validateEmail = (sample) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sample);
    };

    const validateForm = (nameSample, emailSample) => {
        return (nameSample.trim() !== '' && validateEmail(emailSample));
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    // TODO: input text field address?

    // TODO: input text field NPWP

    const handleSwitcedEmailChange = (event) => {
        setSwitchBookEmail(event.target.checked);
        if (switchBookEmail) {
            setEmail('');
            setEmailFieldEnabled(true);
        } else {
            setEmail('default@gmail.com');
            // TODO: change this to user email taken from auth
            setEmailFieldEnabled(false);
        }
    };

    const handleEmailChange = (event) => {
        // TODO: add check box whether the book use user email instead.
        setEmail(event.target.value);
    };

    // TODO: validate all inputs

    const handleSubmit = () => {
        // TODO: change this to the process of adding book to database
        if (validateForm(name, email)) {
            console.log(name);
            console.log(email);
            resetAddBookForm();
        } else {
            setFormError(true);
            return;
        }
        
    };

    return (
        <div>
            <Dialog open={addDialogState} onClose={resetAddBookForm}>
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
                        required
                        value={name}
                        onChange={handleNameChange}
                        error={formError && name.trim() === ''}
                        helperText={formError && name.trim() === '' ? "Cannot be empty" : "fill the book name"}
                    />
                    <TextField 
                        margin='dense'
                        id='useremail'
                        label="Email Address"
                        type='email'
                        fullWidth
                        variant='standard'
                        required
                        value={email}
                        onChange={handleEmailChange}
                        disabled={!emailFieldEnabled}
                        error={formError && !validateEmail(email)}
                        helperText={formError && !validateEmail(email) ? "fix the email format or use default user email" : "fill email or use user email"}
                    />
                    <FormControlLabel label="use user email" control={<Switch onChange={handleSwitcedEmailChange}/>} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetAddBookForm}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}