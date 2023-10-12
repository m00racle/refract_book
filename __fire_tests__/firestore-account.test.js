/*  
    Module: test for firebase-account.js module
    Included test for the firestore.rules related to firebase-account

*/

import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { addDoc, collection, doc, setDoc, setLogLevel } from "firebase/firestore";
import { readFileSync } from "node:fs";

let testEnv;
const sampleAccountAlice = {
    id: "11001",
    refs: {
        book_ref: "alice-book1"
    },
    account_name: "cash",
};

beforeAll(async() => {
    /*  
        This code will be run ONCE in earliest of whole tests run in THIS MODULE
        Basically instantiate... (well that is not quite correct) but you know what I meant
        the test environment.
        To do this we must pass the credential such as ProjectID and also firestore (emulated) 
        setups.
    */
   setLogLevel('error');
   testEnv = await initializeTestEnvironment({
        projectId: "refract-book",
        firestore: {
            host: "127.0.0.1",
            port: 8080,
            rules: readFileSync("firestore.rules", "utf8")
        },
   });
});

afterAll(async () => {
    /*  
        this function will be called ONCE when all tests are finished 
        It should clear the firestore of all (if exist) data.
        Then clean up the process to ensure all promise(s) are closed.
    */
   await testEnv.clearFirestore();
   await testEnv.cleanup();
});

beforeEach(async () => {
    /*  
        this function is called every time a new test (IN THIS MODULE) begin to run
        clear all firestore data 
        ensure you arrage (prepare) the data and don't use previous used data
    */
    await testEnv.clearFirestore();
    // preps a book which will have accounts collection
    await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), "books", "alice-book1"), {
            id: "alice-book1",
            refs: {
                user_id: "alice",
                book_ref: 3
            },
            name: "Book sample3"
        });
    });
});

describe("firestore-account rules", () => {
    /* 
        this part is exclusive to test the firestore.rules 
    */
    test("unauth user must not set accounts", async () => {
        /*  
            test unauthorized user must not add accounts
            this will use the firestore.rules for /books/{bookId}/accounts/ path
            then it will use setDoc and the test MUST assert to fail
            NOTE: setDoc because we want to specify the account id as standard accounting id
        */
        let unauthDb = testEnv.unauthenticatedContext().firestore();
        // act: setDoc while unauthenticated
        await assertFails(setDoc(doc(unauthDb,"books/alice-book1/accounts", "11001"), sampleAccountAlice));
    });

    test("auth user can set accounts", async () => {
        /*  
            test authorized user must be able to set accounts
            set accounts with id "11001"
        */
        // set auth with uid alice
        let authDb = testEnv.authenticatedContext('alice').firestore();
        await assertSucceeds(setDoc(doc(authDb, "books/alice-book1/accounts", "11001"), sampleAccountAlice));
    });

    test("auth user with different uid can't set accounts", async () => {
        /* 
            test case when a user is authenticated but have different uid can't set accounts
            TODO: consider this again, is this still necessary?
        */
        // let authDb = testEnv.authenticatedContext('bruce').firestore();
        // await assertFails(setDoc(doc(authDb, "books/alice-book1/accounts", "11001"), sampleAccountAlice));
    });

    test("only able to get account from valid book", async () => {
        /*  
            test that if passing non valid book it will failed to get account data.
        */
    });

    test("only authentiacated user can delete the account", async () => {
        /*  
            test only authenticated user can delete the account
        */
    });
});