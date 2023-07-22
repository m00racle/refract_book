import { addDoc, collection, getDoc, getDocs, limit, onSnapshot, orderBy, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { el } from 'date-fns/locale';
import { deleteStorageFolder, uploadImageToStorage } from './storage';

// TODO: manage books
// TODO: when adding books it will also add image as logo.
const BOOK_COLLECTION = 'books';

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

    // upload the logo image to the storage first
    const imageFile = bookData.logoFile;
    const fileType = imageFile.name.split('.').pop();
    const storagePath = `${uid}/${book_ref}/logo.${fileType}`;
    const downloadUrl = await uploadImageToStorage(imageFile, storagePath, fileType);

    // prepare the book doc daa
    const bookDocData = {
        refs: {
            user_id: uid,
            book_ref
        },
        name: bookData.name,
        initial: bookData.initial,
        email: bookData.email,
        business_type: bookData.selectedCompanyType,
        npwp: bookData.npwp,
        logoUrl: downloadUrl
    };

    await addDoc(collection(db, BOOK_COLLECTION), bookDocData).catch((err) => {
        console.error("Error adding book: ", err);
        throw err;
    });
}

export async function getAllBooks (uid,  setBooks, setIsLoadingBooks) {
    // show all books related to specific uid.
    const booksQuery = query(collection(db, BOOK_COLLECTION),
    where("refs.user_id", "==", uid),
    orderBy("refs.book_ref", 'desc'));
    
    const unsubscribe = onSnapshot(booksQuery, async (snapshot) => {
        let allBooks = [];
        for (const documentSnapshot of snapshot.docs) {
            const book = documentSnapshot.data();
            allBooks.push({
                ...book,
                id: documentSnapshot.id
            });
        }
        setBooks(allBooks);
        setIsLoadingBooks(false);
    });
    // stop listening to database
    return unsubscribe;
}

export async function getBook (bookId, setBook, setIsLoadingBooks) {
    // show specific book
    const docRef = doc(db, BOOK_COLLECTION, bookId);
    const docSnap = await getDoc(docRef).catch((err) => {
        console.error("Error get a book: ", err);
        throw err;
    });
    // pass the result to setBooks
    setIsLoadingBooks(false);
    if (docSnap.exists) {
        const bookData = docSnap.data();
        setBook({id: docSnap.id, ...bookData});
        // listen to the real time changes
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const updatedBookData = docSnapshot.data();
                setBook({id: docSnapshot.id, ...updatedBookData});
            } else {
                // show no books
                setBook(undefined);
                return undefined;
            }
        })
        return unsubscribe;
    } else {
        // handle book does not exist under specific uid
        setBook(undefined);
        return undefined;
    }
}


export async function editBook () {
    // edit specific book
}

export async function deleteBook (bookId, uid) {
    // fetch the book data
    const docRef = doc(db, BOOK_COLLECTION, bookId);
    const bookSnap = await getDoc(docRef).catch((err) => {
        console.error("Error get a book: ", err);
        throw err;
    });
    // extract the data from bookSnap
    const bookData = bookSnap.data();
    // delete all related images to the book in the storage
    const logoURL = bookData.logoUrl;
    const storagePath = logoURL.substring(logoURL.indexOf("/o/") + 3, logoURL.indexOf("?"));
    try {
        await deleteStorageFolder(storagePath);
    } catch (error) {
        console.error('catch error from deleteStorageFolder: ', error);
        throw error;
    }
    // delete specific book
    try {
        await deleteDoc(docRef);
        
        console.log('Book deleted successfully');
    } catch (error) {
        console.error('Error deleting book: ', error);
        throw error;
    }
}