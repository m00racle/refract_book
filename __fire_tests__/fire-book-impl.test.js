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
    addDoc, setLogLevel
} from 'firebase/firestore';

import { getAllBooks } from "../firebase/firestore-book";

let testEnv2;
let aliceDb, bruceDb, chaseDb;
let initDocs;

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
        */
        let mockLoadingState = false;
        let mockBooks = [];

        // mock the set states
        const mockSetLoading = jest.fn((x) => { mockLoadingState = x;});
        const mockSetBooks = jest.fn((y) => {mockBooks = y});

        // arrange : start getAllBooks
        mockSetLoading(true);
        const getBooksUid = "alice";

        const unsub = await getAllBooks(getBooksUid, mockSetBooks, mockSetLoading, aliceDb);

        // asserts:
        // unsub NOT undefined:
        expect(unsub).toBeDefined();
        // expect isLoading state back to false
        expect(mockLoadingState).toBe(false);
        // expect succeeds to get all 2 books under user_id alice:
        expect(mockBooks).toHaveLength(2);
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

        // unsub
        unsub();
    });
});