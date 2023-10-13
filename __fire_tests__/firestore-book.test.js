import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, onSnapshot, query, setDoc } from "firebase/firestore";
import { expectFirestorePermissionDenied, expectPermissionGetSucceeds } from "./utils";
import { addBook, getAllBooks, getBook } from "../firebase/firestore-book";
import { useState } from "react";
import path from "node:path";

//  const MY_PROJECT_ID = "refract-book";
let testEnv1; // <-- CAUTION: I always forget to define it here since it is global var!
let aliceDb, bruceDb, chaseDb;

beforeAll(async() => {
    // instantiate the test environment for this test
    setLogLevel('error');
    testEnv1 = await initializeTestEnvironment({
        projectId: "firestore-rules-book",
        firestore: {
            host: "127.0.0.1",
            port: 8080,
            rules: readFileSync("firestore.rules", "utf8")
        },
    });
    // clear the firestore first:
    await testEnv1.clearFirestore();

    aliceDb = testEnv1.authenticatedContext('alice').firestore();
    bruceDb = testEnv1.authenticatedContext('bruce').firestore();
    chaseDb = testEnv1.unauthenticatedContext().firestore();
});

afterAll(async () => {
    // closing :
    await testEnv1.clearFirestore();
    await testEnv1.cleanup();
});

describe("testing firestore rules", () => {
    /* 
        test firestore.rules
    */
   test("test CRUD in firestore.rules with 3 user types", async () => {
        /* 
            test CRUD with 3 types of users
            1. aliceDb : authenticated user uid= alice
            2. bruceDb : authenticated user uid= bruce
            3. chaseDb : non authenticated user
        */

        let dataBook = {refs: {user_id: "alice"}, name: "Book sample"};
       
        await testEnv1.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), "books", "alice-book1"), {
                id: "alice-book1",
                refs: {
                    user_id: "alice",
                },
                name: "Book sample3"
            });
        });

        // test addDoc:
        // authenticated user and owner of the doc allowed:
        await assertSucceeds(addDoc(collection(aliceDb, "books"), dataBook));
        await assertFails(addDoc(collection(bruceDb, "books"), dataBook));
        await assertFails(addDoc(collection(chaseDb, "books"), dataBook));

        // test getDoc:
        await assertSucceeds(getDoc(doc(aliceDb, "books", "alice-book1")));
        await assertFails(getDoc(doc(bruceDb, "books", "alice-book1")));
        await assertFails(getDoc(doc(chaseDb, "books", "alice-book1")));

        // test setDoc create new doc:
        let dataNewSet = {
            refs: {
                user_id: "bruce"
            },
            name: "Book New Set",
            initial: "BNS"
        };
        await assertFails(setDoc(doc(aliceDb, "books", "book-new-set"), dataNewSet));
        await assertSucceeds(setDoc(doc(bruceDb, "books", "book-new-set"), dataNewSet));
        await assertFails(setDoc(doc(chaseDb, "books", "book-new-set"), dataNewSet));
    });
});