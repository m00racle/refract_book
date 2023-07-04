import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import BookCard from '../components/BookCard';
import '@testing-library/jest-dom/extend-expect';

// Mocking the next/router module
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('BookCard component', () => {
  it('renders the book name correctly', () => {
    // Arrange
    const bookId = 1;
    const bookData = { name: 'Sample Book' };
    const deleteFunc = jest.fn(); // Mock the delete function

    // Mocking the useRouter hook
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    // Act
    render(<BookCard bookId={bookId} bookData={bookData} deleteFunc={deleteFunc} />);
    
    // Assert
    const bookName = screen.getByText('Sample Book');
    expect(bookName).toBeInTheDocument();
  });

  it('opens the delete confirmation dialog when delete button is clicked', () => {
    // Arrange
    const bookId = 1;
    const bookData = { name: 'Sample Book' };
    const deleteFunc = jest.fn(); // Mock the delete function

    // Mocking the useRouter hook
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    // Act
    render(<BookCard bookId={bookId} bookData={bookData} deleteFunc={deleteFunc} />);
    
    const deleteButton = screen.getByTestId('delete-book-fab');
    fireEvent.click(deleteButton);

    // Assert
    const dialogTitle = screen.getByTestId('alert-delete-dialog-title');
    const dialogContent = screen.getByTestId('alert-delete-dialog-description');

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogContent).toBeInTheDocument();
  });

  // Other tests...
});