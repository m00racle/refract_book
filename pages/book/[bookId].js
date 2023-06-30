import { useRouter } from 'next/router';
import Head from 'next/head';
import NavBar from '../../components/navbar';

export default function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;

  return (
    <>
    <Head><title>Book {bookId}</title></Head>

    <NavBar />
    <div>
      <h1>Book ID: {bookId}</h1>
    </div>
    </>
  );
}
