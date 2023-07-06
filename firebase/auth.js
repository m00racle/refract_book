/* handles auth processes and states 
    Provide access to firebase auth functionalities and data
    accross the app code.
*/

import { useState } from "react";
import { auth } from "./firebase";
import { useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { createContext } from "react";
import { useContext } from "react";

// give other context or files the ability to access the firebase auth state
// change the auth state
// connect or maybe better word is subscribe to the auth service once the 
// firebase auth (state) changed
// need observer to then get intended data (uid and email) from firebase auth
// access the authenticated user data (uid and email)

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = () => {
        // function to reset the authUser and isLoading
        setAuthUser(null);
        setIsLoading(false);
    };

    // I need observer to handle user argument from onAuthStateChanged asynchrounously
    const authStateHandler = (user) => {
        // extract the user data (user id and email?)
        if (!user) {
            // : function to reset the authUser and isLoading to default values
            clear();
            return;
        }

        // authUser is object consist of user auth data uid and email
        setAuthUser({
            uid: user.uid,
            email: user.email
        });
        // if done means user is already loaded
        setIsLoading(false);
    };

    // whenever the function is mounted subscribe to the auth service
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateHandler) // : I need observer <user> func
        // done the business then get out
        return () => unsubscribe();
    }, []);

    // I think I need to put signout also
    const signOut = () => authSignOut(auth);

    return {authUser, isLoading, signOut};
}

// Build context that convey the objects consist of things uid, email, loading state, and function to signOut.
// build JSX component to enable its children to access the objects above.
// don't forget to export the context hook to be accessed using JS and not only in JSX component.

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
    // stated as loading searching for auth
    signOut: async () => {}
    // the signOut function will be empty since nothing from firebase auth yet
});

export function AuthUserProvider({ children }) {
    const auth = useFirebaseAuth();
    // note this override the auth from ./firebase?

    // return the JSX component representing the context
    return (<AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>);
}

export const useAuth = () => useContext(AuthUserContext);