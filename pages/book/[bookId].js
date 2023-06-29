import { useRouter } from 'next/router';

export default function BookPage() {
  const router = useRouter();
  const { bookId } = router.query;

  return (
    <div>
      <h1>Book ID: {bookId}</h1>
    </div>
  );
}
