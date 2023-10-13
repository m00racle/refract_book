/*  
utilities for testing. I still not sure to put this here or in the fire-test folder
*/
import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { expect } from '@jest/globals';

export function parseHostAndPort(hostAndPort) {
    if (hostAndPort == undefined) {return undefined; }
    const pieces = hostAndPort.split(':');
    return {
        host: pieces[0],
        port: parseInt(pieces[1], 10),
    };
}

export async function expectFirestorePermissionDenied(promise) {
    /*  
        function to validate the exception is firestore permission denied
        Param:
            promise: Promise<Any>
    */
    const errorResult = await assertFails(promise);
    expect(errorResult.code).toBe('permission-denied' || 'PERMISSION_DENIED');
}

export async function expectPermissionGetSucceeds(promise) {
    /* 
        function to validate getDocs on firestore rules.
    */
    expect(assertSucceeds(promise)).not.toBeUndefined();
  }