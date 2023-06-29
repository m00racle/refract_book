import React, { useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import Head from 'next/head';
import NavBar from '../components/navbar';
import BookCard from '../components/BookCard';
import AddBook from '../components/AddBook';
import dummies from '../dummy1.json';

const Dashboard = ({ userEmail, onSignOut }) => {
  const [books, setBooks] = useState(dummies);
  const deleteBook = (deleteId) => {
    // TODO: dummy test only to demonstrate delete and mapping of data
    setBooks(books.filter(book => book.id !== deleteId));
  };

  return (
    <>
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
            <BookCard key={book.id} bookId={book.id} bookData={book}/>
          ))}
          <AddBook />
        </Grid>
      </Container>
      
    </>
  );
};

export default Dashboard;
