
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import { Button, Dialog } from '@mui/material';
import styles from '../styles/landing.module.scss';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase';
import { useAuth } from '../firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';

// when user logged in redirect to dashboard:
const REDIRECT_PAGE = '/dashboard';

// config for Firebase UI auth
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: REDIRECT_PAGE,
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID
  ],
};

export default function Home() {
  // what is the auth state? is it still loading?
  const { authUser, isLoading } = useAuth();
  // NOTE: from useAuth hook in ../firebase/auth took only authUser and isLoading 
  // no SignOut button here

  const router = useRouter();
  
  // make state for login page from StyledFirebaseAuth
  const [login, setLogin] = useState(false);

  // when user is authenticated then authUser !== null and isLoading is false:
  // then redirect them to dashboard
  useEffect(() => {
    if (!isLoading && authUser) {
      router.push(REDIRECT_PAGE);
    }
  }, [authUser, isLoading]);

  return (
    <div>
      <Head>
        <title>Bookeeper</title>
      </Head>

      <main>
        <Container className={styles.container}>
          <Typography variant="h1">Welcome to Bookeeper!</Typography>
          <Typography variant="h2">Simple Accounting App</Typography>
          <div className={styles.buttons}>
            <Button variant="contained" color="secondary" onClick={() => setLogin(true)}>
              {/* button clicked will set login = true which open dialog */}
              Login / Register
            </Button>
          </div>
          <Dialog onClose={() => setLogin(false)} open={login}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
          </Dialog>
        </Container>
      </main>
    </div>);
}
