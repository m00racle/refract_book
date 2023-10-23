import { addDoc, collection, getDoc, setDoc, limit, onSnapshot, orderBy, query, where, doc, deleteDoc, getDocs } from 'firebase/firestore';
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

    // addDoc with refs to get the docId: (this is just to assign doc id to be used later)
    const docRef = await addDoc(collection(dBase, BOOK_COLLECTION),{
        refs:{user_id: uid}
    }).catch((e) => {
        // console.log("addDoc error: ", e); //<- for DEBUG only!
        throw e;
    });

    // upload the logo image to the storage first
    const imageFile = bookData.logoFile;
    if (imageFile instanceof Blob) {
        // NOTE: for safety and testing reasons:
        fileType = imageFile.name.split('.').pop();
        storagePath = `${uid}/${docRef.id}/settings/logo.${fileType}`;
        downloadUrl = await uploadImageToStorage(imageFile, storagePath, fileType);
    } else {
        downloadUrl = "";
    }
    
    // prepare the book doc and include the id = docRef.id into the data
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

    // we update the data using setDoc to be able to include doc id into the doc data:
    await setDoc(doc(dBase, BOOK_COLLECTION, docRef.id), bookDocData).catch((err) => {
        // console.error("Error adding book: ", err); //<- for DEBUG only!
        throw err;
    });
}

export async function getAllBooks (uid,  setBooks, setIsLoading, dBase=db) {
    /* 
        get all books for specific AUTHENTICATED user.
        Then put the listener (onSnapshot) to detect any changes to the any of the book
        that will affect the whole group of books

        CAUTION: onSnapshot is listenenr and only listen for activities post activation

        PARAMS:
        uid : string = user id
        setBooks : funciton = useState hook setter for book
        setIsLoading : function = useState hook setter for isLoading
        dBase : firestore = firestore instance (default db from firebase.js)
    */
    setIsLoading(true);
    const booksQuery = query(collection(dBase, BOOK_COLLECTION),
    where("refs.user_id", "==", uid),
    orderBy("id", 'desc'));
    const docSnaps = await getDocs(booksQuery).catch((err) => {
        setIsLoading(false);
        throw err;
    });

    // getBooks if it was already in the database when listener onSnapshot has not being set:
    let initBooks = [];
    for (const docSnap of docSnaps.docs) {
        const docData = docSnap.data();
        initBooks.push({ ...docData });
    }
    setBooks(initBooks);

    // set listeners for any updates that match the query (update, add, delete, set docs)
    const unsubscribe = onSnapshot(booksQuery, async (snapshot) => {
        let allBooks = [];
        for (const documentSnapshot of snapshot.docs) {
            const book = documentSnapshot.data();
            allBooks.push({ ...book });
        }
        // console.log('allBooks: ', allBooks); //<- for DEBUG purposees
        setBooks(allBooks);
    });
    // return unsubscribe function to give ability for the caller to stop listening to database
    setIsLoading(false);
    return unsubscribe;
}

export async function getBook (bookId, setBook, setIsLoading, dBase=db) {
    /* 
        get one specific book
        if permission error throw error

        CAUTION: if the book does not exist and the user somehow pass the auth
        the getDoc will NOT throw error it will just return exist = false!

        PARAMS:
        bookId : String = book Id which called
        setBook : function = useState hook setter function for book
        setIsLoading : function = useState hook for isLoading
    */
    setIsLoading(true);
    const docRef = doc(dBase, BOOK_COLLECTION, bookId);
    const docSnap = await getDoc(docRef).catch((err) => {
        // console.error("Error get a book: ", err); //<- for DEBUG
        setBook(undefined);
        setIsLoading(false);
        throw err;
    });
    // pass the result to setBooks
    
    if (docSnap.exists) {
        // set the book on docSnap.data
        setBook(docSnap.data());
        setIsLoading(false);
    } else {
        // meaning the book does not exist (SEE CAUTION in block comment)
        // set the book to be undefined
        setBook(undefined);
        setIsLoading(false);
    }
}


export async function editBook () {
    // edit specific book
}

export async function deleteBook (bookId, uid, dBase=db) {
    /* 
        delete specific book 

        PARAMS:
        bookId : String = book id to be deleted
        uid : String = user (authenticated) id that owned the soon to be deleted book
        dBase : firestore = firestore instance authenticted for user id
    */
    // fetch the book data
    const docRef = doc(dBase, BOOK_COLLECTION, bookId);
    const bookSnap = await getDoc(docRef).catch((err) => {
        // console.error("Error get a book: ", err);
        throw err;
    });
    // extract the data from bookSnap
    const bookData = bookSnap.data();
    // const bookRef = bookData.refs.book_ref; //<-- TODO: this will create error no more book_ref
    
    // delete specific book
    try {
        await deleteDoc(docRef);
        
        // console.log('Book deleted successfully');
    } catch (error) {
        // console.error('Error deleting book: ', error);
        throw error;
    }

    // delete the folder:
    if (bookData.logoUrl) {
        try {
            const storagePath = `${uid}/${bookId}`;
            await deleteStorageFolder(storagePath);
        } catch (error) {
            // console.error('catch error from deleteStorageFolder: ', error);
            throw error;
        }
    }
}