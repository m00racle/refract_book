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

    // TODO: create books for the prepared scenarios
});

afterAll(async() => {
    /* 
        clear and clean all promises to avoid bugs
        also to prepare clean slate environment for the next test if available
    */

    await testEnv3.clearFirestore();
    await testEnv3.cleanup();
});