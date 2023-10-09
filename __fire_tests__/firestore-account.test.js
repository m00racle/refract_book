/*  
    Module: test for firebase-account.js module
    Included test for the firestore.rules related to firebase-account

*/

import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { setLogLevel } from "firebase/firestore";
import { readFileSync } from "node:fs";

let testEnv;

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
});

describe("firestore-account rules", () => {
    /* 
        this part is exclusive to test the firestore.rules 
    */
    test("unauth user must not add accounts", async () => {
        /*  
            test unauthorized user must not add accounts
            this will use the firestore.rules for /books/{bookId}/accounts/ path
            then it will use addDoc and the test MUST assert to fail
        */
        // expect(true).toBeFalsy();
    });

    test("auth user can add accounts", async () => {
        /*  
            test authorized user must be able to add accounts
        */
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