import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel } from "firebase/firestore";
import { expectFirestorePermissionDenied } from "./utils";
import { addBook } from "../firebase/firestore-book";

//  const MY_PROJECT_ID = "refract-book";
let testEnv; // <-- CAUTION: I always forget to define it here since it is global var!

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
    test("Understand basic addition", () => {
        expect(2 + 2).toBe(4);
    });

    test("Unauthorized user must not add doc", async() => {
        // make unauth context
        let unauthDb = testEnv.unauthenticatedContext().firestore();
        await expectFirestorePermissionDenied(addDoc(collection(unauthDb, "books"),{name: "book1"}));
    });
    
    test("Unauth user cant addBook", async() => {
        
        let unauthDb2 = testEnv.unauthenticatedContext().firestore();
        await assertFails(addBook("",{
            refs: {
                user_id: "alice",
                book_ref: 1
            },
            name: "Book sample",
            initial: "BS",
            email: "alice@example.com",
            business_type: "perseroan",
            npwp:""
        }, unauthDb2).catch((error) => {
            // trhow the error
            throw error;
        }));
    });

    test("Auth user can addDoc firestore", async() => {
        let aliceDb = testEnv.authenticatedContext('alice').firestore();
        await assertSucceeds(addDoc(collection(aliceDb, "books"),{
            refs: {
                user_id: "alice",
                book_ref: 1
            },
            name: "Book sample",
            initial: "BS",
            email: "alice@example.com",
            business_type: "perseroan",
            npwp:""
        }));
    });
});