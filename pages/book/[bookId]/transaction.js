/*  
page to handle transaction
*/

import { useRouter } from "next/router";
import Head from 'next/head';
import PageNavBar from '../../../components/BookNavBar';

export default function TransactionPage() {
    const router = useRouter();
    const { bookId } = router.query;
    
    const formattedBookId = bookId ? bookId.toString() : '';

    const formatNum = {
        style: 'decimal',
        useGrouping: true,
        maximumFractionDigits: 2,
    };

    return (
        <>
        <Head>
            <title>{`Transaction ${formattedBookId}`}</title>
        </Head>
        <PageNavBar bookId={formattedBookId} />
        <div>
            <h1>Transaction Book ID: {(bookId * 1234567 / 3).toLocaleString('id-ID', formatNum)}</h1>
        </div>
        </>
    );
}