/*  
    module: firestore-account
    CREATE, READ, UPDATE, DELETE
    for accounts
    definition:
    accounts is the component that represent the classification in Ledger
*/


export async function addAccount() {
    /*  
        function add account
        create new account with random account ID?
    */
};

export async function setAccount() {
    /*  
        function set account
        create or overwrite (if exist) account
        but if we want to make new account you need to specify the account ID manually
    */
};

export async function getAccount() {
    /*  
     get (read) fetch single account
    */
};

export async function getManyAccounts() {
    /*  
        get (read) fetch many accounts at once
        usually for deliberate multiple accounts such as book front page or ledger page
    */
};

export async function updateAccounts() {
    /*  
        update an existing accounts
    */
};

export async function deleteAccounts() {
    /*  
        delete an existing accounts
    */
};