/*  
Handle the cloud storage management
*/
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImageToStorage(file, filePath, fileType) {
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file, {
        contentType: `image/${fileType}`,
    });

    // get download URL of the uploaded file
    const downloadUrl = await getDownloadURL(storageRef);
    
    return downloadUrl;
}

export async function deleteStorageFolder(folderPath) {
    const folderRef = ref(storage,folderPath);
    
    // start delete directory

    try {
        // List all items inside the folder (files)
        const { items } = await listAll(folderRef);

        // Delete all files one by one
        const deleteFilePromises = items.map(async (item) => {
            await deleteObject(item);
        });

        // Wait for all files to be deleted
        await Promise.all(deleteFilePromises);

        // List all prefixes inside the folder (subfolders)
        const { prefixes } = await listAll(folderRef);

        // Delete all subfolders recursively
        const deleteSubfolderPromises = prefixes.map(async (prefix) => {
            const subfolderPath = prefix.fullPath;
            await deleteStorageFolder(subfolderPath);
        });

        // Wait for all subfolders to be deleted
        await Promise.all(deleteSubfolderPromises);

        // The folder is now genuinely empty, try to delete it
        try {
            await deleteObject(folderRef);
            console.log(`Directory ${folderPath} is deleted successfully.`);
        } catch (error) {
            // The folder is not empty and cannot be deleted at this point.
            // It will be automatically deleted when its contents are removed.
            console.log(`Directory ${folderPath} is not empty.`);
        }

        console.log(`Directory ${folderPath} is deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting directory ${folderPath}: `, error);
        throw error;
    }
}