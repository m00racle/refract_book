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
});