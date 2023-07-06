import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import NavBar from '../components/navbar';
import BookCard from '../components/BookCard';
import AddBook from '../components/AddBook';
import dummies from '../dummy1.json';
import { useAuth } from '../firebase/auth';
import { useRouter } from 'next/router';

const Dashboard = () => {
  // state for user auth :
  const { authUser, isLoading } = useAuth();

  // prepare router to redirect user if not signed in
  const router = useRouter();

  // TODO: useState here is for dummy test only change later with the real QUERY transaction from DATABASE
  const [books, setBooks] = useState(dummies);
  const deleteBook = (deleteId) => {
    // TODO: dummy test only to demonstrate delete and mapping of data
    // change this later to the real database delete transaction
    // WARNING: this will be restored to the original dummy data when the page is refreshed.
    setBooks(books.filter(book => book.id !== deleteId));
  };

  // listen for changes to loading or whether authUser !== null, redirect if necessary
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push('/');
    }
  }, [authUser, isLoading]);

  return ((!authUser) ? 
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
            <BookCard key={book.id} bookId={book.id} bookData={book} deleteFunc={deleteBook}/>
          ))}
          <AddBook />
        </Grid>
      </Container>
      
    </div>
  );
};

export default Dashboard;
