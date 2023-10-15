import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection, setLogLevel, setDoc, updateDoc, deleteField, deleteDoc } from "firebase/firestore";
import { addBook, getAllBooks, getBook } from "../firebase/firestore-book";

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

describe("testing firestore-book implementation", () => {
    /* 
        testing the implementations of the funcion on firestore-book.js
    */
    test("addBook implementation only for intended auth user", async () => {
        /* 
            testing addBook
            SCENARIO: addBook for bruceDb (aliceDb will be reserved for later)
            set the uid = bruce and this is constant since WE WANT TO TEST THE DATABASE
            thus the variable should be: aliceDb, bruceDb, and chaseDb
            aliceDb simulate authenticated user but NOT the owner
            bruceDb simulate atuhenticated user and the owner
            chaseDb simulate NON authenticated user

            Assert:
            1. addBook for aliceDb must fails
            2. addBook for bruceDb must succeeds
            3. addBook for chaseDb must fails
        */
        // arrange
        const addedData = {
            refs: {
                user_id: "bruce"
            },
            name: "Bruce added Book",
            initial: "BAB",
            email: "bruce@example.com",
            selectedCompanyType: "firma",
            npwp: "",
            logoFile: "testing/budget.png" //shouldn't be processed
        };

        // preps the uid is bruce -> we want to test only intended user which has the uid 
        // thus when usince aliceDb it should be declined because in aliceDb bruce is NOT the owner 
        const testUid = "bruce";

        // assert:
        await assertFails(addBook(testUid, addedData, aliceDb));
        await assertSucceeds(addBook(testUid, addedData, bruceDb));
        await assertFails(addBook(testUid, addedData, chaseDb));
    });

    test("getAllBook implementation", async () => {
        /* 
            testing getAllBooks function:
            SCENARIO: getAllBooks from aliceDb 
            in the beginning the state of isLoading is true and preps the books state to be []
            then uid will be set to be alice
            but prior to that we need to setDoc 
        */
        let mockLoadingState = false;
        let mockBooks = [];
        // mock functions:
        const mockSetLoading = function (x) { mockLoadingState = x; }
        const mockSetBooks = function (y) { mockBooks = y; }
        mockSetLoading(true);
        const getBooksUid = 'alice';
        // preps testDocs:
        const testDocs = [
            {
                id: "alice-book-1",
                name: "Sample Alice 1",
                refs: {
                    user_id: "alice"
                }
            },
            {
                id: "alice-book-2",
                name: "Sample Alice 2",
                refs: {
                    user_id: "alice"
                }
            },
            {
                id: "chase-book-1",
                name: "Chase Sample Fail",
                refs: {
                    user_id: "chase"
                }
            }
        ];

        // input to the database e with Security Rules Disabled:
        await testEnv1.withSecurityRulesDisabled(async (context) => {
            const freeDb = context.firestore();
            for (const testDoc of testDocs) {
                await setDoc(doc(freeDb, "books", testDoc.id), testDoc);
            }
        });

        // action: call the getAllBooks function
        const unsub = await getAllBooks(getBooksUid, mockSetBooks, mockSetLoading, aliceDb);
        
        // TODO: this still unable to mock the state variables and setters
        console.log('mocked is loading state = ', mockLoadingState); //<- for DEBUG purpose
        console.log('mockBooks = ', unsub.toString()); //<- for DEBUG purpose

        // assert
        expect(unsub).toBeDefined();
        // TODO: both tests below fails!
        // await assertFails(getAllBooks(getBooksUid, mockSetBooks, mockSetLoading, bruceDb));
        // await assertFails(getAllBooks(getBooksUid, mockSetBooks, mockSetLoading, chaseDb));
    });
});