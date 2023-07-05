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
    // const userEmailInput = screen.getByLabelText('Email Perusahaan');
    // const switchEmailCheckbox = screen.getByLabelText('pakai email user');
    // const addressInput = screen.getByLabelText('Alamat Perusahaan');
    // const companyTypeSelect = screen.getByLabelText('Pilih Tipe Perusahaan:');
    // const npwpInput = screen.getByLabelText('NPWP Perusahaan');

    expect(bookNameInput).toBeInTheDocument();
    // expect(userEmailInput).toBeInTheDocument();
    // expect(switchEmailCheckbox).toBeInTheDocument();
    // expect(addressInput).toBeInTheDocument();
    // expect(companyTypeSelect).toBeInTheDocument();
    // expect(npwpInput).toBeInTheDocument();
  });

  // Other tests...
});
