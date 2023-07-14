import { useRouter } from 'next/router';
import Head from 'next/head';
import PageNavBar from '../../components/BookNavBar';
import { useAuth } from '../../firebase/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getBook } from '../../firebase/firestore-book';

export default function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;
  const formattedBookId = bookId ? bookId.toString() : '';
  
  // auth verification
  const { authUser, isLoading } = useAuth();

  const [book, setBook] = useState({});
  const [isLoadingBook, setIsloadingBook] = useState(true);

  // listen to isLoading and authUser changes:
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  useEffect(() => {
    const fetchBook = async () => {
      const unsubscribe = await getBook(formattedBookId, setBook, setIsloadingBook).catch((err) => {
        console.error("catch the throwed err from getBook function: ", err);
      });
      
      if (unsubscribe === undefined) {
        // book does not exis or user don't have access
        router.push('/dashboard');
        return;
      }

      return () => {
        // unsubscribe from real-time updates when the component unmounts
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };

    fetchBook();
  }, [authUser, formattedBookId]);

  

  return ((!authUser || isLoadingBook) ?
    <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '25%' }}/>
    :
    <>
      <Head>
        <title>{`Book ${formattedBookId}`}</title>
      </Head>
      <PageNavBar bookId={formattedBookId} />
      <div>
        <h1>Book ID: {formattedBookId}</h1>
      </div>
    </>
  );
}
