import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import NavBar from '../components/navbar';
import BookCard from '../components/BookCard';
import AddBook from '../components/AddBook';
import { useAuth } from '../firebase/auth';
import { useRouter } from 'next/router';
import { getAllBooks, deleteBook } from '../firebase/firestore-book';

const Dashboard = () => {
  // state for user auth :
  const { authUser, isLoading } = useAuth();

  // prepare router to redirect user if not signed in
  const router = useRouter();

  // TODO: useState here is for dummy test only change later with the real QUERY transaction from DATABASE
  const [books, setBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      console.log('Book deleted successfully');
    } catch (error) {
      console.error('catch error from deleteBook: ', error);
    }

  };

  // listen for changes to loading or whether authUser !== null, redirect if necessary
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  // get book once user is logged in
  useEffect(() => {
    const fetchBooks = async () => {
      if (authUser) {
        const unsubscribe = await getAllBooks(authUser.uid, setBooks, setIsLoadingBooks);
        return () => unsubscribe();
      }
    };

    fetchBooks();
    
  }, [authUser]);

  return ((!authUser || isLoadingBooks) ? 
    <CircularProgress color='inherit' sx={{marginLeft: '50%', marginTop: '25%'}}/>
    :
    <div>
      <Head><title>Dashboard</title></Head>

      <NavBar />
      <Container>
        <Typography component='h2'
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '2rem',
              md: '2.5rem',
              lg: '3rem',
            },
          }}
        >
          List of Books
        </Typography>
        <Grid container spacing={3}>
          {books.map((book) => (
            // you don't need useEffect hooks here when the books data is changed in useState it will update the BookCard
            <BookCard key={book.id} bookId={book.id} bookData={book} deleteFunc={handleDeleteBook}/>
          ))}
          <AddBook />
        </Grid>
      </Container>
      
    </div>
  );
};

export default Dashboard;
