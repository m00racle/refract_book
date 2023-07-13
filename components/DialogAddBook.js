import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Switch, Select } from '@mui/material';
import { useAuth } from '../firebase/auth';
import { addBook } from '../firebase/firestore-book';
import ErrorDialog from './ErrorDialog';

export default function DialogAddBook({ addDialogState, handleClose }) {
    // build dialog when user click add book button
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [initial, setInitial] = useState('');
    const [npwp, setNpwp] = useState('');
    const [switchBookEmail, setSwitchBookEmail] = useState(false);
    const [emailFieldEnabled, setEmailFieldEnabled] = useState(true);
    const [formError, setFormError] = useState(false);
    const [selectedCompanyType, setSelectedCompanyType] = useState('');
    const companyTypes = ['Perorangan', 'Firma', 'Komanditer', 'Perseroan'];
    const { authUser, signOut } = useAuth();

    // : make handle local close to make the switch back to off and clear the email address

    const resetAddBookForm = () => {
        // reset all fields in the addBook dialog content
        setName('');
        setEmail('');
        setEmailFieldEnabled(true);
        setSwitchBookEmail(false);
        setFormError(false);
        setInitial('');
        setNpwp('');
        setSelectedCompanyType('');

        // close the dialog:
        handleClose();
    };

    // validate
    
    const validateEmail = (sample) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(sample);
    };

    const validateForm = (nameSample, emailSample, typeSample, initialSample) => {
        // validate: name is not empty and email is pass the regex test
        return (nameSample.trim() !== '' 
            && validateEmail(emailSample)
            && initialSample.trim() !== ''
            && companyTypes.includes(typeSample));
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleCompanyTypeChange = (event) => {
        setSelectedCompanyType(event.target.value);
    };

    //  input text field initial?
    const handleInitialChange = (event) => {
        setInitial(event.target.value);
    };

    // : input text field NPWP
    const handleNpwpChange = (event) => {
        setNpwp(event.target.value);
    };

    const handleSwitcedEmailChange = (event) => {
        setSwitchBookEmail(event.target.checked);
        if (switchBookEmail) {
            setEmail('');
            setEmailFieldEnabled(true);
        } else {
            setEmail(authUser?.email);
            
            setEmailFieldEnabled(false);
        }
    };

    const handleEmailChange = (event) => {
        
        setEmail(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    
    const handleSnackbar = () => {
        setSnackbarOpen(true);
    };

    const handleOpenErrorDialog = (message) => {
        setErrorMessage(message);
        setErrorDialogOpen(true);
    };

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
    };

    const handleSubmit = async () => {
        // TODO: change this to the process of adding book to database
        if (validateForm(name, email, selectedCompanyType, initial)) {
            console.log("nama perusahan:", name);
            console.log("email perusahaan: ", email);
            console.log("Alamat: ", initial);
            console.log("Tipe Perusahaan: ", selectedCompanyType)
            console.log("NPWP: ", authUser?.uid);
            const bookData = {
                name, email, selectedCompanyType, npwp
            };
            await addBook(authUser?.uid, bookData)
            .then(() => {
                // : handle snackbar
                handleSnackbar();
                resetAddBookForm();
            })
            .catch((err) => {
                
                // : handle error dialog
                const errMsg = `Failed to AddBook: ${err}`;
                handleOpenErrorDialog(errMsg);
            });

            
        } else {
            setFormError(true);
            return;
        }
        
    };

    return (
        <div>
            {/* Snackbar component */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                Book added successfully!
                </MuiAlert>
            </Snackbar>
            <Dialog open={addDialogState} onClose={resetAddBookForm}>
                <DialogTitle>Add New Book</DialogTitle>
                
                <DialogContent>
                    <DialogContentText>
                        Provide the data for the new book
                    </DialogContentText>
                    <TextField 
                        autoFocus
                        margin='dense'
                        data-testid="bookname"
                        id='bookname'
                        label="Nama Perusahaan"
                        type='text'
                        fullWidth
                        variant='standard'
                        required
                        value={name}
                        onChange={handleNameChange}
                        error={formError && name.trim() === ''}
                        helperText={formError && name.trim() === '' ? "Harus diisi" : ""}
                    />
                    <TextField 
                        margin='dense'
                        id='useremail'
                        data-testid="useremail"
                        label="Email Perusahaan"
                        type='email'
                        fullWidth
                        variant='standard'
                        required
                        value={email}
                        onChange={handleEmailChange}
                        disabled={!emailFieldEnabled}
                        error={formError && !validateEmail(email)}
                        helperText={formError && !validateEmail(email) ? "format email salah (saran: pakai email user)" : "isi email perusahaan atau pilih email user"}
                    />
                    <FormControlLabel label="pakai email user" control={<Switch onChange={handleSwitcedEmailChange}/>} />
                    <TextField 
                        margin='dense'
                        id='initial'
                        data-testid="initial"
                        label="Inisial Perusahaan"
                        type='text'
                        fullWidth
                        variant='standard'
                        required
                        value={initial}
                        onChange={handleInitialChange}
                        error={formError && initial.trim() === ''}
                        helperText={formError && initial.trim() === '' ? "Harus diisi" : ""}
                    />
                    <FormControl 
                        fullWidth
                        error={formError && !companyTypes.includes(selectedCompanyType)}
                        // WARNING: this form control can't have helperText so I omit it
                        sx={{marginY: "0.5em"}}
                    >
                        <InputLabel id="select-company-type-label" data-testid="select-company-type-label" >Pilih Tipe Perusahaan:</InputLabel>
                        <Select
                            labelId="select-company-type-label"
                            id='company-type-selected'
                            value={selectedCompanyType}
                            onChange={handleCompanyTypeChange}
                        >
                            {companyTypes.map((companyType, index) => (
                                <MenuItem key={index} value={companyType}>
                                    {companyType}
                                </MenuItem>
                            ))}
                        </Select>
                        {formError && !companyTypes.includes(selectedCompanyType) && (
                            <Typography data-testid="error-helper-text-comp-type" variant="caption" color="error">
                                Pilih salah satu tipe perusahaan
                            </Typography>
                        )}
                    </FormControl>
                    <TextField 
                        margin='dense'
                        id='npwp'
                        data-testid='npwp'
                        label="NPWP Perusahaan"
                        fullWidth
                        type='text'
                        variant='standard'
                        value={npwp}
                        onChange={handleNpwpChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetAddBookForm}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
            <ErrorDialog open={errorDialogOpen} onClose={handleCloseErrorDialog} errorMessage={errorMessage} />
        </div>
    );
}