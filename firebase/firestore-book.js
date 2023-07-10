import { addDoc } from 'firebase/firestore';
import { db } from './firebase';

// TODO: manage books
const BOOK_COLLECTION = 'books';

async function getBookId () {
    // this is specific function to get the most book Id
    // use this to make new book id
}

export function addBook() {
    // function to handle add new book to firestore
}

export async function getAllBooks () {
    // show all books related to specific uid.
}

export async function getBook () {
    // show specific book
}

export async function editBook () {
    // edit specific book
}

export async function deleteBook () {
    // delete specific book
}