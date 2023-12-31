/*  
page to handle document
*/

import { useRouter } from "next/router";
import Head from 'next/head';
import PageNavBar from '../../../components/BookNavBar';
import { CircularProgress } from '@mui/material';
import { useAuth } from "../../../firebase/auth";
import { useEffect } from "react";

export default function DocumentPage() {
    const router = useRouter();
    const { bookId } = router.query;
    
    const formattedBookId = bookId ? bookId.toString() : '';

    // auth verification
    const { authUser, isLoading } = useAuth();

    // listen to isLoading and authUser changes:
    useEffect(() => {
        if (!isLoading && !authUser) {
        router.push('/');
        }
    }, [authUser, isLoading]);

    return ((!authUser) ?
        <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '25%' }}/>
        :
        <>
        <Head>
            <title>{`Transaction ${formattedBookId}`}</title>
        </Head>
        <PageNavBar bookId={formattedBookId} />
        <div>
            <h1>Document Book ID: {formattedBookId}</h1>
        </div>
        </>
    );
}