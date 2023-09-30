import { 
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { expectFirestorePermissionDenied } from "../firebase/utils";

//  const MY_PROJECT_ID = "refract-book";

 describe("firestore-book rules", () => {
    test("Understand basic addition", () => {
        expect(2 + 2).toBe(4);
    });

    test("Unauthorized user must not add doc", async() => {
        // set the test environment
        let testEnv = await initializeTestEnvironment({
            projectId: "refract-book",
            firestore: {
                host: "127.0.0.1",
                port: 8080,
                rules: readFileSync("firestore.rules","utf8")
            },
        });

        // make unauth context
        let unauthDb = testEnv.unauthenticatedContext().firestore();
        await expectFirestorePermissionDenied(addDoc(collection(unauthDb, "books"),{name: "book1"}));
    });
    
 });