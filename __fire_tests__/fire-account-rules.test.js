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
    setLogLevel
} from "firebase/firestore";

let testEnv3; // name of the test environment
let aliceDb, bruceDb, chaseDb; // 3 database represent 3 types of user
let addRef; // reference as the result of addAccount
let initDocs; // initial data for books

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