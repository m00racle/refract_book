import { addDoc, collection, getDoc, setDoc, limit, onSnapshot, orderBy, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { deleteStorageFolder, uploadImageToStorage } from './storage';


const BOOK_COLLECTION = 'books';

export async function addBook(uid, bookData, dBase=db) {
    /* 
        function to create new Book. 
        The id for the new Book set automatically by system (use addDoc)
        NOTE: when using addDoc you need to refer using collections
        then acquire the document id from the response 
        for setDoc you need to refer using doc.

        params:
        uid: String = user id
        bookData: object = data about the created Book
        dBase: firestore = used database (default db from ./firestore)
    */
    let fileType, storagePath, downloadUrl;
    // addDoc with refs to get the docId:
    const docRef = await addDoc(collection(dBase, BOOK_COLLECTION),{
        refs:{user_id: uid}
    }).catch((e) => {
        throw e;
    });
    // upload the logo image to the storage first
    const imageFile = bookData.logoFile;
    if (imageFile instanceof Blob) {
        fileType = imageFile.name.split('.').pop();
        storagePath = `${uid}/${docRef.id}/settings/logo.${fileType}`;
        downloadUrl = await uploadImageToStorage(imageFile, storagePath, fileType);
    } else {
        downloadUrl = "";
    }
    

    // prepare the book doc daa
    const bookDocData = {
        refs: {
            user_id: uid,
        },
        id: docRef.id,
        name: bookData.name,
        initial: bookData.initial,
        email: bookData.email,
        business_type: bookData.selectedCompanyType,
        npwp: bookData.npwp,
        logoUrl: downloadUrl
    };

    await setDoc(doc(dBase, BOOK_COLLECTION, docRef.id), bookDocData).catch((err) => {
        // console.error("Error adding book: ", err);
        throw err;
    });
}

export async function getAllBooks (uid,  setBooks, setIsLoading, dBase=db) {
    // show all books related to specific uid.
    const booksQuery = query(collection(dBase, BOOK_COLLECTION),
    where("refs.user_id", "==", uid),
    orderBy("id", 'desc'));
    
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
        setIsLoading(false);
    });
    // stop listening to database
    return unsubscribe;
}

export async function getBook (bookId, setBook, setIsLoadingBooks, dBase=db) {
    // show specific book
    const docRef = doc(dBase, BOOK_COLLECTION, bookId);
    const docSnap = await getDoc(docRef).catch((err) => {
        // console.error("Error get a book: ", err);
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

export async function deleteBook (bookId, uid, dBase=db) {
    // fetch the book data
    const docRef = doc(dBase, BOOK_COLLECTION, bookId);
    const bookSnap = await getDoc(docRef).catch((err) => {
        console.error("Error get a book: ", err);
        throw err;
    });
    // extract the data from bookSnap
    const bookData = bookSnap.data();
    const bookRef = bookData.refs.book_ref;
    const storagePath = `${uid}/${bookRef}`;
    
    // delete specific book
    try {
        await deleteDoc(docRef);
        
        console.log('Book deleted successfully');
    } catch (error) {
        console.error('Error deleting book: ', error);
        throw error;
    }

    // delete the folder:
    try {
        await deleteStorageFolder(storagePath);
    } catch (error) {
        console.error('catch error from deleteStorageFolder: ', error);
        // throw error;
    }
}