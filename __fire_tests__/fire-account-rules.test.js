/* 
    TEST for Firestore Database rules 
    for Accounts sub collections
*/

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import {
    doc,
    setDoc,
    addDoc,
    setLogLevel,
    collection
} from "firebase/firestore";

let testEnv3; // name of the test environment
let aliceDb, bruceDb, chaseDb; // 3 database represent 3 types of user
let addRef; // reference as the result of addAccount <- this is prone to edit
let initDocs; // initial data for books

let user_id = "";
let book_id = "alice-book-2";

let accData1 = {
    name: "Cash",
    type: "asset",
    subtype: "current asset",
    balance: 0,
    refs: {
        user_id,
        book_id,
    }
};


beforeAll(async() => {
    /* 
        Prepare test environment, database and documents needed
    */

    setLogLevel('error');
    testEnv3 = await initializeTestEnvironment({
        projectId: "firestore-rules-account",
        firestore: {
            host: "127.0.0.1",
            port: 8080,
            rules: readFileSync("firestore.rules", "utf8")
        },
    });

    // clear firestore first:
    await testEnv3.clearFirestore();

    // prepare database for 3 different scenarios
    aliceDb = testEnv3.authenticatedContext('alice').firestore();
    bruceDb = testEnv3.authenticatedContext('bruce').firestore();
    chaseDb = testEnv3.unauthenticatedContext().firestore();

    // : create books for the prepared scenarios
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
    await testEnv3.withSecurityRulesDisabled(async (context) => {
        const initDb = context.firestore();
        for (const initDoc of initDocs) {
            await setDoc(doc(initDb, "books", initDoc.id), initDoc);
        }
    });
});

afterAll(async() => {
    /* 
        clear and clean all promises to avoid bugs
        also to prepare clean slate environment for the next test if available
    */

    await testEnv3.clearFirestore();
    await testEnv3.cleanup();
});

// function to define which sub accounts collection to target in the test
const accountsCollection = function (db, bookId) {
    const booksCollection = collection(db, "books");
    const bookDocRef = doc(booksCollection, bookId);
    return collection(bookDocRef, "accounts");
};

describe("testing firestore.rules for account sub collection", () => {
    /* 
        testing module for firestore.rules for account sub coolection
        CRUD testing for account sub collection
    */

    test("test CREATE for unauthenticated chaseDb", async () => {
        /* 
            testing addDoc for chaseDb 
            the test addDoc a account data called cash.
            the book_id will be set to chase-book-1 which is correct
            the user_id will be set to chase thus is correct
            but chaseDb is unauth thus this will be wrong
            But in this case the account will failed to be added
        */
        
        user_id = "chase";
        book_id = "chase-book-1";
        // update the doc data:
        accData1.refs.user_id = user_id;
        accData1.refs.book_id = book_id;

        // assert 
        await assertFails(addDoc(accountsCollection(chaseDb, "chase-book-1"), accData1));
    });

    test("test CREATE for auth wrong user, correct book id", async () => {
        /* 
            testing addDoc for bruceDb
            the db is bruceDb which is authenticated
            user_id will be bruce which is authenticated
            the bookId will be "alice-book-2" which is NOT belong to bruce
            this MUST BE fail!
        */
        
        user_id = "bruce";
        book_id = "alice-book-2";
        // update the doc data:
        accData1.refs.user_id = user_id;
        accData1.refs.book_id = book_id;

        // assert
        await assertFails(addDoc(accountsCollection(bruceDb, book_id), accData1));
    });

    test("test CREATE correct auth user but wrong book id", async () => {
        /* 
            test the correct user
            authenticated user
            but wrong book_id (the refs book_id alice-book-1 )
            the addDoc reference use alice-book-2
            MUST ALSO FAILED
        */
        
        user_id = "alice";
        book_id = "alice-book-1";
        // update the doc data
        accData1.refs.user_id = user_id;
        accData1.refs.book_id = book_id;

        // assert
        await assertFails(addDoc(accountsCollection(aliceDb, "alice-book-2"), accData1));
    });

    test("test CREATE correct auth user and book", async () => {
        /* 
            test correct user and book
            user alice
            book alice-book-2
        */
        
        user_id = "alice";
        book_id = "alice-book-2";
        // update the doc data
        accData1.refs.user_id = user_id;
        accData1.refs.book_id = book_id;

        // action
        addRef = await addDoc(accountsCollection(aliceDb, book_id), accData1);
        assertSucceeds(addRef);
    });
});