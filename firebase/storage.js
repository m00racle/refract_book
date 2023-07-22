/*  
Handle the cloud storage management
*/
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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
        await deleteObject(folderRef);

        // test: console log delete
        console.log(`directory ${folderPath} is deleted`);
    } catch (error) {
        console.error(`Error deleting directory ${folderPath}: `, error);
        throw error;
    }
}