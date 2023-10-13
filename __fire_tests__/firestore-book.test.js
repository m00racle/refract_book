import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, onSnapshot, query, setDoc } from "firebase/firestore";
import { addBook, getAllBooks, getBook } from "../firebase/firestore-book";

//  const MY_PROJECT_ID = "refract-book";
let testEnv1; // <-- CAUTION: I always forget to define it here since it is global var!
let aliceDb, bruceDb, chaseDb;

beforeAll(async() => {
    /* 
        test CRUD with 3 types of users
        1. aliceDb : authenticated user uid= alice
        2. bruceDb : authenticated user uid= bruce
        3. chaseDb : non authenticated user
    */
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
        test firestore.rules for collection "books"
    */
    test("test CRUD in firestore.rules with 3 user types", async () => {
        /* 
            test addDoc
            Scenario: addDoc for alice to aliceDb
            Assert:
            1. addDoc to aliceDb must succeed
            2. addDoc to bruceDb must fails
            3. addDoc to chaseDb must fails
        */
        
        let dataBook = {refs: {user_id: "alice"}, name: "Book sample"};

        // test addDoc:
        // authenticated user and owner of the doc allowed:
        await assertSucceeds(addDoc(collection(aliceDb, "books"), dataBook));
        await assertFails(addDoc(collection(bruceDb, "books"), dataBook));
        await assertFails(addDoc(collection(chaseDb, "books"), dataBook));
    });

    test("test getDoc scenarios", async () => {
        /* 
            test getDoc:
            Scenario: getDoc for alice from aliceDb
            We setDoc to add one more Doc with id alice-book1

            Assert:
            1. getDoc to aliceDb must succeed
            2. getDoc to bruceDb must fails
            3. getDoc to chaseDb must fails
        */
        await testEnv1.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), "books", "alice-book1"), {
                id: "alice-book1",
                refs: {
                    user_id: "alice",
                },
                name: "Book sample3"
            });
        });
        // test getDoc:
        await assertSucceeds(getDoc(doc(aliceDb, "books", "alice-book1")));
        await assertFails(getDoc(doc(bruceDb, "books", "alice-book1")));
        await assertFails(getDoc(doc(chaseDb, "books", "alice-book1")));
    });

    test("test setDoc scenario create new doc", async () => {
        /* 
            setDoc for creating new doc
            SCENARIO: setDoc to create new doc for bruce
            Assert:
            1. setDoc to aliceDb must fails
            2. setDoc to bruceDb must succeeds
            3. setDoc to chaseDb must fails
        */
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