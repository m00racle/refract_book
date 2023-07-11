import { addDoc, collection, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { el } from 'date-fns/locale';

// TODO: manage books
const BOOK_COLLECTION = 'books';

async function getBookId () {
    // this is specific function to get the most book Id
    // use this to make new book id
}

export async function addBook(uid, bookData) {
    // function to handle add new book to firestore
    let book_ref;
    const bookIdQuery = query(
        collection(db, BOOK_COLLECTION),
        where('refs.user_id', '==', uid),
        orderBy('refs.book_ref', 'desc'),
        limit(1)
    );

    const bookIdQuerySnapshot = await getDocs(bookIdQuery).catch((err) => {
        console.error('Error querying books: ', err);
        throw err;
    });

    if (bookIdQuerySnapshot.empty) {
        // no book exist yet for this user
        book_ref = 1;
    } else {
        const lastBookId = bookIdQuerySnapshot.docs[0].data().refs.book_ref;
        book_ref = lastBookId + 1;
    }

    // prepare the book doc daa
    const bookDocData = {
        refs: {
            user_id: uid,
            book_ref
        },
        name: bookData.name,
        email: bookData.email,
        business_type: bookData.selectedCompanyType,
        npwp: bookData.npwp
    };

    await addDoc(collection(db, BOOK_COLLECTION), bookDocData).catch((err) => {
        console.error("Error adding book: ", err);
        throw err;
    });
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