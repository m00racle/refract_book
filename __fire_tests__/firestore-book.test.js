import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, onSnapshot, query, setDoc } from "firebase/firestore";
import { expectFirestorePermissionDenied } from "./utils";
import { addBook, getAllBooks, getBook } from "../firebase/firestore-book";
import { useState } from "react";

//  const MY_PROJECT_ID = "refract-book";
let testEnv; // <-- CAUTION: I always forget to define it here since it is global var!

beforeAll(async () => {
    // silence expected rules rejections from firestore SDK. 
    // unexpected rejection still bubble up and will be thrown as an error
    setLogLevel('error');
    // set the test environment
    testEnv = await initializeTestEnvironment({
        projectId: "refract-book",
        firestore: {
            host: "127.0.0.1",
            port: 8080,
            rules: readFileSync("firestore.rules","utf8")
        },
    });
});

afterAll(async () => {
    // clear the firestore database after the last test is done.
    await testEnv.clearFirestore();
    // clean up all rules test environment 
    // to avoid any left over async processed that prevent test to finish!!
    await testEnv.cleanup();
});

beforeEach(async () => {
    // clear firestore
    await testEnv.clearFirestore();
});

describe("firestore-book rules", () => {
    /* 
        test for all firestore rules related to firestore-book.js
    */
    test("Unauthorized user must not add doc", async() => {
        // make unauth context
        let unauthDb = testEnv.unauthenticatedContext().firestore();
        await expectFirestorePermissionDenied(addDoc(collection(unauthDb, "books"),{name: "book1"}));
    });

    test("Auth unintended user cannot addDoc", async() => {
        let bruceDb = testEnv.authenticatedContext('bruce').firestore();
        await assertFails(addDoc(collection(bruceDb, "books"),{
            refs: {
                user_id: "alice",
            },
            name: "Book sample",
            initial: "BS",
            email: "alice@example.com",
            business_type: "perseroan",
            npwp:""
        }));
    });

    test("Auth user can addDoc firestore", async() => {
        let aliceDb = testEnv.authenticatedContext('alice').firestore();
        await assertSucceeds(addDoc(collection(aliceDb, "books"),{
            refs: {
                user_id: "alice",
            },
            name: "Book sample",
            initial: "BS",
            email: "alice@example.com",
            business_type: "perseroan",
            npwp:""
        }));
    });

    test('Auth user cannot get data that not owned', async () => {
        // looks like this should be get rather than onSnapshot!
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'books/bruce-book'), {
                refs: {
                    user_id: "bruce",
                },
                name: "Book sample",
                initial: "BS",
                email: "alice@example.com",
                business_type: "perseroan",
                npwp:""
            });
        });
        let aliceDb = testEnv.authenticatedContext('alice').firestore();
        
        const docRef = doc(aliceDb, "books", 'bruce-book');
        await assertFails(getDoc(docRef));
    });

    test('Auth user able get data that owned', async () => {
        // looks like this should be get rather than onSnapshot!
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'books/bruce-book'), {
                refs: {
                    user_id: "bruce",
                },
                name: "Book sample",
                initial: "BS",
                email: "alice@example.com",
                business_type: "perseroan",
                npwp:""
            });
        });
        let bruceDb = testEnv.authenticatedContext('bruce').firestore();
        
        const docRef = doc(bruceDb, "books", 'bruce-book');
        await assertSucceeds(getDoc(docRef));
    });
});

describe("firestore-book implementations", () => {
    /* 
        test for firestore-book.js implementations
    */
    test("Unauth user cant addBook", async() => {
        const unauthDb = testEnv.unauthenticatedContext().firestore();
        const uidTest = "alice";
        const bookData = {
        name: "Book sample",
        initial: "BS",
        email: "alice@example.com",
        selectedCompanyType: "perseroan",
        npwp: "",
        logoFile: undefined
        };
      
        // Pass the same database instance to the addBook() function that you are using in your test
        await assertFails(addBook(uidTest, bookData, unauthDb));
    });

    test("get all books exist", async () => {
        var books = [];
        //  arrange : create mock functions
        const setIsLoading = jest.fn();
        const setBooks = jest.fn((x) => {
            books = books.concat(x);
        });

        // Arrange: Create mock database using withSecurityRulesDisabled
        const bookList = [
            {
            id: "alice-book2",
            refs: {
                user_id: "alice",
            },
            name: "Book sample4"
            },
            {
            id: "alice-book1",
            refs: {
                user_id: "alice",
            },
            name: "Book sample3"
            },
            {
            id: "bruce-book1",
            refs: {
                user_id: "bruce",
            },
            name: "Book sample2"
            },
            {
            id: "charlie-book1",
            refs: {
                user_id: "charlie",
            },
            name: "Book sample1"
            }
        ];

        for (const book of bookList) {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                await setDoc(doc(context.firestore(), "books", book.id), book);
            });
        };

        //  call the getAllBooks function 
        let aliceDb = testEnv.authenticatedContext('alice').firestore();
        const result = await getAllBooks('alice', setBooks, setIsLoading, aliceDb);
        expect(result).toBeDefined();
    });

    test("getBook available return defined", async () => {
        const mockIsLoading = jest.fn();
        const mockBook = jest.fn();

        // Arrange: Create mock database using withSecurityRulesDisabled
        const bookList = [
            {
            id: "alice-book2",
            refs: {
                user_id: "alice",
            },
            name: "Book sample4"
            },
            {
            id: "alice-book1",
            refs: {
                user_id: "alice",
            },
            name: "Book sample3"
            },
            {
            id: "bruce-book1",
            refs: {
                user_id: "bruce",
            },
            name: "Book sample2"
            },
            {
            id: "charlie-book1",
            refs: {
                user_id: "charlie",
            },
            name: "Book sample1"
            }
        ];

        for (const book of bookList) {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                await setDoc(doc(context.firestore(), "books", book.id), book);
            });
        };

        //  call the getAllBooks function 
        let aliceDb = testEnv.authenticatedContext('alice').firestore();
        const result = getBook('alice-book1', mockBook, mockIsLoading, aliceDb);

        // assert
        expect(result).toBeDefined();
    });
});