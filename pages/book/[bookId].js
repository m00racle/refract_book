import { useRouter } from 'next/router';
import Head from 'next/head';
import PageNavBar from '../../components/BookNavBar';

export default function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;
  const formattedBookId = bookId ? bookId.toString() : '';

  return (
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
