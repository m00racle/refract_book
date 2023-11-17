import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, setDoc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";

//  const MY_PROJECT_ID = "refract-book";
let testEnv1; // <-- CAUTION: I always forget to define it here since it is global var!
let aliceDb, bruceDb, chaseDb;
let succeedRef

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
        succeedRef = await addDoc(collection(aliceDb, "books"), dataBook)
        // console.log('succeedResult = ', succeedRef.id); // <- DEBUG: see the promise
        assertSucceeds(succeedRef);
        await assertFails(addDoc(collection(bruceDb, "books"), dataBook));
        await assertFails(addDoc(collection(chaseDb, "books"), dataBook));
    });

    test("test getDoc scenarios", async () => {
        /* 
            test getDoc:
            Scenario: getDoc for alice from aliceDb
            We will use the PROMISE result from previous test that alter the suceedRef

            Assert:
            1. getDoc to aliceDb must succeed
            2. getDoc to bruceDb must fails
            3. getDoc to chaseDb must fails
        */
        // fetch the doc id from previous addDoc test:
        const refId = succeedRef.id;
        await assertSucceeds(getDoc(doc(aliceDb, "books", refId)));
        await assertFails(getDoc(doc(bruceDb, "books", refId)));
        await assertFails(getDoc(doc(chaseDb, "books", refId)));
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

    test("update doc using setDoc (rewrite)", async () => {
        /* 
            setDoc but to re-write (update) existing doc
            SCENARIO: using the previously created doc with id: book-new-set
            and then setDoc to change the name and initial
            Assert:
            Assert:
            1. setDoc to aliceDb must fails
            2. setDoc to bruceDb must succeeds
            3. setDoc to chaseDb must fails
        */
        // arrange: prepare the updated data
        let updateSet = {
            refs: {
                user_id: "bruce"
            },
            name: "Bruce's Book1",
            initial: "BB",
            id: "book-new-set"
        };

        // ASSERT:
        await assertFails(setDoc(doc(aliceDb, "books", "book-new-set"), updateSet));
        await assertSucceeds(setDoc(doc(bruceDb, "books", "book-new-set"), updateSet));
        await assertFails(setDoc(doc(chaseDb, "books", "book-new-set"), updateSet));
    });

    test("update doc using updateDoc", async () => {
        /* 
            updateDoc to update the existing doc
            SCENARIO: using the doc created by the addDoc to aliceDb
            referred using the succeedRef.id 
            test the utilization of updateDoc to this doc

            NOTE: to update nested object data you need to use "" since 
            object does not allow the use of . (dot) notation

            Assert:
            1. updateDoc to aliceDb must succeeds
            2. updateDoc to bruceDb must fails
            3. updateDoc to chaseDb must fails
        */
        // arrange:
        const updateRef = succeedRef.id;
        const updateData = {
            id: updateRef, // add new field id
            name: "Alice's Book1", // change the name
            initial: "AB", //add new field initial
            "refs.test": true //add new (nested) field test
        };

        // assert:
        await assertSucceeds(updateDoc(doc(aliceDb, "books", updateRef), updateData));
        await assertFails(updateDoc(doc(bruceDb, "books", updateRef), updateData));
        await assertFails(updateDoc(doc(chaseDb, "books", updateRef), updateData));
    });

    test("delete fields from existing doc", async () => {
        /* 
            delete fields from existind doc
            SCENARIO: using the aliceDb doc from the addDoc test
            delete the field (nested) refs.test

            NOTE: this is still part of updateDoc since we want to update by deleting

            assert:
            1. deleteFields to aliceDb must succeeds
            2. deleteFields to bruceDb must fails
            3. deleteFields to chaseDb must fails
        */
        const fieldRef = succeedRef.id;
        // assert:
        await assertSucceeds(updateDoc(doc(aliceDb, "books", fieldRef), {"refs.test": deleteField()}));
        await assertFails(updateDoc(doc(bruceDb, "books", fieldRef), {"refs.test": deleteField()}));
        await assertFails(updateDoc(doc(chaseDb, "books", fieldRef), {"refs.test": deleteField()}));
    });

    test("delete the whole doc", async () => {
        /* 
            delete the whole doc
            SCENARIO: using the aliceDb doc from addDoc test
            delete the whole field

            assert:
            1. deleteDoc to aliceDb must succeeds
            2. deleteDoc to bruceDb must fails
            3. deleteDoc to chaseDb must fails
        */
        const deleteRef = succeedRef.id;
        // assert: 
        // NOTE: the assertion sequence is reversed to ensure the firestore database
        // consistencies and stability
        
        await assertFails(deleteDoc(doc(bruceDb, "books", deleteRef)));
        await assertFails(deleteDoc(doc(chaseDb, "books", deleteRef)));
        await assertSucceeds(deleteDoc(doc(aliceDb, "books", deleteRef)));
    });
});

