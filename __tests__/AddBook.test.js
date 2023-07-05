import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddBook from '../components/AddBook';
import '@testing-library/jest-dom/extend-expect';

describe('AddBook component', () => {
  it('opens the dialog with specific input fields when add book button is clicked', () => {
    // Arrange
    render(<AddBook />);
    
    const addButton = screen.getByTestId('add-book-fab');
    fireEvent.click(addButton);

    // Assert
    const bookNameInput = screen.getByTestId('bookname');
    const emailInput = screen.getByTestId("useremail");
    const addressInput = screen.getByTestId("address-multiline");
    
    expect(bookNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();
  });

  // Other tests...
});
