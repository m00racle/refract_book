/*  
page to handle transaction
*/

import { useRouter } from "next/router";
import Head from 'next/head';
import PageNavBar from '../../../components/BookNavBar';

export default function TransactionPage() {
    const router = useRouter();
    const { bookId } = router.query;
    console.log("router query: ", router.query);
    const formattedBookId = bookId ? bookId.toString() : '';
    // const formattedTarget = target ? target.toString() : '';

    return (
        <>
        <Head>
            <title>{`Transaction ${formattedBookId}`}</title>
        </Head>
        <PageNavBar bookId={formattedBookId} />
        <div>
            <h1>Transaction Book ID: {formattedBookId}</h1>
        </div>
        </>
    );
}