/* 
    Temporary I want to use this to test the firestore-book 
*/

import { readFileSync } from "node:fs";
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import {doc, 
    setDoc, 
    collection, 
    addDoc, setLogLevel, updateDoc
} from 'firebase/firestore';

import { addBook, getAllBooks } from "../firebase/firestore-book";

let testEnv2;
let aliceDb, bruceDb, chaseDb;
let initDocs;
let mockLoadingState, mockBooks;

// mock the set states
const mockSetLoading = jest.fn((x) => { mockLoadingState = x;});
const mockSetBooks = jest.fn((y) => {mockBooks = y});

beforeAll(async () => {
    setLogLevel('error');
    testEnv2 = await initializeTestEnvironment({
        projectId: "firestore-implementation-book",
        firestore: {
            host: "127.0.0.1",
            port: 8080,
            rules: readFileSync("firestore.rules", "utf8")
        },
    });

    aliceDb = testEnv2.authenticatedContext('alice').firestore();
    bruceDb = testEnv2.authenticatedContext('bruce').firestore();
    chaseDb = testEnv2.unauthenticatedContext().firestore();
    // prep initial mock data:
    initDocs = [
        {
            refs: {
                user_id: 'alice'
            },
            id: "alice-book-1",
            name: "sample book alice 1",
            initial: "SBA1",
            email: "alice@example.com",
            business_type: "perorangan",
            npwp: "",
            logoUrl: ""
        },
        {
            refs: {
                user_id: 'alice'
            },
            id: "alice-book-2",
            name: "sample book alice 2",
            initial: "SBA2",
            email: "alice2@example.com",
            business_type: "firma",
            npwp: "123456-7890",
            logoUrl: ""
        },
        {
            refs: {
                user_id: 'bruce'
            },
            id: "bruce-book-1",
            name: "sample book Bruce 1",
            initial: "SBB1",
            email: "bruce@example.com",
            business_type: "komanditer",
            npwp: "09876545",
            logoUrl: ""
        },
        {
            refs: {
                user_id: 'bruce'
            },
            id: "bruce-book-2",
            name: "sample book Bruce 2",
            initial: "SBB2",
            email: "bruce2@example.com",
            business_type: "perseroan",
            npwp: "8888888",
            logoUrl: ""
        },
        {
            refs: {
                user_id: 'chase'
            },
            id: "chase-book-1",
            name: "sample book CHASE 1",
            initial: "SBC1",
            email: "chase@example.com",
            business_type: "perorangan",
            npwp: "",
            logoUrl: ""
        }
    ];
    // load the initData
    await testEnv2.withSecurityRulesDisabled(async (context) => {
        const initDb = context.firestore();
        for (const initDoc of initDocs) {
            await setDoc(doc(initDb, "books", initDoc.id), initDoc);
        }
    });
});

afterAll(async () => {
    // closing
    await testEnv2.clearFirestore();
    await testEnv2.cleanup();
});

describe("testting firestore-book implementation", () => {
    /* 
        testing the implementation of the firestore-book.js
    */
    test("getAllBooks implementation", async () => {
        
        /* 
            this is the test to getAllBooks
            the test divided into two steps
            1. Reading all books from existing database set on beforeAll
            2. Reading updated data and added data into database

            Assert: only read all books related to user_id alice not other
        */
        mockLoadingState = false;
        mockBooks = [];

        // mock the set states
        // const mockSetLoading = jest.fn((x) => { mockLoadingState = x;});
        // const mockSetBooks = jest.fn((y) => {mockBooks = y});

        // arrange : start getAllBooks
        mockSetLoading(true);
        const getBooksUid = "alice";

        const unsub = await getAllBooks(getBooksUid, mockSetBooks, mockSetLoading, aliceDb);

        // asserts:
        // unsub NOT undefined:
        expect(unsub).toBeDefined();
        // expect isLoading state back to false
        expect(mockLoadingState).toBe(false);
        // expect get 3 of alice's docs (added one onSnapshot):
        expect(mockBooks).toHaveLength(2);
        // test the content of the getBooks now should added with alice-book-3 book.
        expect(mockBooks).toEqual(expect.arrayContaining([
            {
                refs: {
                    user_id: 'alice'
                },
                id: "alice-book-1",
                name: "sample book alice 1",
                initial: "SBA1",
                email: "alice@example.com",
                business_type: "perorangan",
                npwp: "",
                logoUrl: ""
            },
            {
                refs: {
                    user_id: 'alice'
                },
                id: "alice-book-2",
                name: "sample book alice 2",
                initial: "SBA2",
                email: "alice2@example.com",
                business_type: "firma",
                npwp: "123456-7890",
                logoUrl: ""
            }
        ]));

        // test detect database changes
        // update existing alice book 1 data
        await updateDoc(doc(aliceDb, "books", "alice-book-1"), {npwp:"00"});
        // set new bruce book
        await setDoc(doc(bruceDb, "books", "bruce-book-3"), {
            refs: {
                user_id: 'bruce'
            },
            id: "bruce-book-3",
            name: "sample book Bruce 3",
            initial: "SBB3",
            email: "bruce3@example.com",
            business_type: "firma",
            npwp: "87878",
            logoUrl: ""
        });

        // set new alice book
        await setDoc(doc(aliceDb, "books", "alice-book-3"), {
            refs: {
                user_id: 'alice'
            },
            id: "alice-book-3",
            name: "sample book alice 3",
            initial: "SBA3",
            email: "alice3@example.com",
            business_type: "komanditer",
            npwp: "-7890",
            logoUrl: ""
        });

        // asserts:
        // expect isLoading state back to false
        expect(mockLoadingState).toBe(false);
        // expect succeeds to get all 2 books under user_id alice:
        expect(mockBooks).toHaveLength(3);
        // test the content of the getBooks
        expect(mockBooks).toEqual(expect.arrayContaining([
            {
                refs: {
                    user_id: 'alice'
                },
                id: "alice-book-1",
                name: "sample book alice 1",
                initial: "SBA1",
                email: "alice@example.com",
                business_type: "perorangan",
                npwp: "00",
                logoUrl: ""
            },
            {
                refs: {
                    user_id: 'alice'
                },
                id: "alice-book-2",
                name: "sample book alice 2",
                initial: "SBA2",
                email: "alice2@example.com",
                business_type: "firma",
                npwp: "123456-7890",
                logoUrl: ""
            },
            {
                refs: {
                    user_id: 'alice'
                },
                id: "alice-book-3",
                name: "sample book alice 3",
                initial: "SBA3",
                email: "alice3@example.com",
                business_type: "komanditer",
                npwp: "-7890",
                logoUrl: ""
            }
        ]));

        // unsub
        unsub();
    });

    test("getAllBooks prevent unauth database reading", async () => {
        /* 
            test getAllBooks but using chaseDb (unauth context)
        */
        mockBooks=[];
        mockLoadingState=false;
        
        // assert fails no return since it will throw error:
        // assert fails getting existing uid with no authenticated user:
        await assertFails(getAllBooks("chase", mockSetBooks, mockSetLoading, chaseDb));
        // assert fails getting existing uid but with wrong auth user_id:
        await assertFails(getAllBooks("bruce", mockSetBooks, mockSetLoading, aliceDb));
        // assert fails getting non existing uid:
        await assertFails(getAllBooks("david", mockSetBooks, mockSetLoading, aliceDb));
    });

    test("addBook only allow authenticated and correct data formats", async () => {
        /* 
            test addBook to bruceDb (add another book)
            only correct authenticated format will succeed
        */
        // arrange: preps addedData
        const addedData = {
            refs: {
                user_id: "bruce"
            },
            name: "Bruce added Book",
            initial: "BAB",
            email: "bruce@example.com",
            selectedCompanyType: "firma",
            npwp: "",
            logoFile: "testing/budget.png" //shouldn't be processed
        };
        const addUserId = "bruce"

        // asserts:
        // 1. addBook the data to aliceDb will failed
        await assertFails(addBook(addUserId, addedData, aliceDb));
        // 2. addBook to bruceDb must be success
        await assertSucceeds(addBook(addUserId, addedData, bruceDb));
        // 3. addBook using authenticated user must be fail.
        await assertFails(addBook(addUserId, addedData, chaseDb));
    });
});