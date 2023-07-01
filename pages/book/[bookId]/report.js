/*  
page to handle report
*/

import { useRouter } from "next/router";
import Head from 'next/head';
import PageNavBar from '../../../components/BookNavBar';

export default function DocumentPage() {
    const router = useRouter();
    const { bookId } = router.query;
    
    const formattedBookId = bookId ? bookId.toString() : '';

    return (
        <>
        <Head>
            <title>{`Transaction ${formattedBookId}`}</title>
        </Head>
        <PageNavBar bookId={formattedBookId} />
        <div>
            <h1>Report for Book ID: {formattedBookId}</h1>
        </div>
        </>
    );
}