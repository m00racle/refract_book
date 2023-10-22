import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../firebase/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getBook } from '../../firebase/firestore-book';
import BookNavBar from '../../components/BookNavBar';
import OverviewContent from '../../components/book/OverviewContent';
import TransactionContent from '../../components/book/TransactionContent';

export default function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;
  const formattedBookId = bookId ? bookId.toString() : '';
  
  // auth verification
  const { authUser, isLoading, setIsLoading } = useAuth();

  const [book, setBook] = useState({});
  const [content, setContent] = useState('overview');

  const availableContents = {
    overview: OverviewContent,
    transaction: TransactionContent
  };

  // listen to isLoading and authUser changes:
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  useEffect(() => {
    // If either authUser or formattedBookId is not available, do nothing
    if (!authUser || !formattedBookId) {
      // this part of code is needed since router.query is lazy
      // I need to wait until the formattedBookId is filled with BookId
      return;
    }

    const fetchBook = async () => {
      setIsLoading(true);
      await getBook(formattedBookId, setBook, setIsLoading).catch((err) => {
        console.error("catch the throwed err from getBook function: ", err);
      });
      
      if (book === undefined) {
        // book does not exis or user don't have access
        router.push('/dashboard');
        return;
      }
    };

    fetchBook();
  }, [authUser, formattedBookId]);

  const RenderedContent = availableContents[content] || OverviewContent;
  

  return ((!authUser || isLoading) ?
    <CircularProgress color="inherit" sx={{ marginLeft: '50%', marginTop: '25%' }}/>
    :
    <>
      <Head>
        <title>{`Book ${book.name}`}</title>
      </Head>
      <BookNavBar bookData={book} contentType={content} setContentFunct={setContent}/>
      <div>
        <RenderedContent bookData={book} contentType={content} setContentFunct={setContent} />
      </div>
    </>
  );
}
