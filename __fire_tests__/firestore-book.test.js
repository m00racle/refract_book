import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, onSnapshot, query, setDoc } from "firebase/firestore";
import { expectFirestorePermissionDenied, expectPermissionGetSucceeds } from "./utils";
import { addBook, getAllBooks, getBook } from "../firebase/firestore-book";
import { useState } from "react";
import path from "node:path";

//  const MY_PROJECT_ID = "refract-book";
let testEnv; // <-- CAUTION: I always forget to define it here since it is global var!
let aliceDb, bruceDb, chaseDb;

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
    // set the firestore instances with 3 users (2 auth and 1 not auth):
    aliceDb = testEnv.authenticatedContext('alice').firestore();
    bruceDb = testEnv.authenticatedContext('bruce').firestore();
    chaseDb = testEnv.unauthenticatedContext().firestore();
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
    test("Only auth INTENDED OWNER can addDoc", async () => {
        /* 
            test that ONLY authenticated intended owner that can add new Doc
            There will be 3 instances of firestore db:
            1. aliceDb : the owner of the document and authenticated
            2. bruceDb : NOT the owner of the document but authenticated
            3. chaseDb : NOT the owner and NOT authenticated

            Assert: ONLY aliceDb that succeeds to addDoc.
        */
        const bookData = {
            refs: {
                user_id: "alice",
            },
            name: "Book sample",
            initial: "BS",
            email: "alice@example.com",
            business_type: "perseroan",
            npwp:""
        };

        // asserts:
        // aliceDb success to adddoc
        await assertSucceeds(addDoc(collection(aliceDb, "books"), bookData));
        // bruceDb failed to addDoc
        await assertFails(addDoc(collection(bruceDb, "books"), bookData));
        // chaseDb failed to addDoc
        await assertFails(addDoc(collection(chaseDb, "books"), bookData));
    });

    test('only authenticated OWNER can getDoc', async () => {
        /* 
            test that only AUTHENTICATED OWNER can access and get doc
            I will make 3 instances of firestore:
            - aliceDb authenticated as Alice but Alice is NOT doc owner
            - bruceDb authenticated as Bruce and the OWNER of the doc
            - charlieDb unauthenticated user

            Assert only bruceDb that succeeds to access the doc using getDoc function.
        */
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'books', 'bruce-book'), {
                refs: {
                    user_id: "bruce",
                },
                name: "Bruce Sample",
                initial: "BrS",
                email: "bruce@example.com",
                business_type: "komanditer",
                npwp:""
            });
        });
        
        let aliceRef = doc(aliceDb, "books", 'bruce-book');
        // let bruceRef = doc(bruceDb, "books", 'bruce-book');
        let chaseRef = doc(chaseDb, "books", 'bruce-book');
        await expectFirestorePermissionDenied(getDoc(aliceRef));
        // await expectPermissionGetSucceeds(getDoc(bruceRef));
        await expectFirestorePermissionDenied(getDoc(chaseRef));
    });
});

describe("firestore-book implementations", () => {
    /* 
        test for firestore-book.js implementations
    */
    test("Unauth user cant addBook", async() => {
        
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
        await assertFails(addBook(uidTest, bookData, chaseDb));
    });

    test("Auth user addBook", async () => {
        /* 
            test for authenticated user to addBook
            NOTE: I can't add image (logo) to this test due to failing path.
            I think it needs NextJS server side render to add the image using path.
        */
        
        const uidTest = "alice";
        let bookData = {
            name: "Book Alice",
            initial: "BA",
            email: "user@example.com",
            selectedCompanyType: "komanditer",
            npwp: "12345",
            logoFile: "./budget.png"
        };

        // preps:
        // aliceDb = testEnv.authenticatedContext(uidTest).firestore();

        // assert
        await assertSucceeds(addBook(uidTest, bookData, aliceDb));
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
        // let aliceDb = testEnv.authenticatedContext('alice').firestore();
        let result = await getAllBooks('alice', setBooks, setIsLoading, aliceDb);
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
        // let aliceDb = testEnv.authenticatedContext('alice').firestore();
        let result = getBook('alice-book1', mockBook, mockIsLoading, aliceDb);

        // assert
        expect(result).toBeDefined();
    });
});