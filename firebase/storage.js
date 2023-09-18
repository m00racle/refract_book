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
    const listRef = ref(storage,folderPath);
    
    // start delete directory

    await listAll(listRef)
        .then((res) => {
            res.prefixes.forEach(async (folderRef) => {
                // All the prefixes under listRef.
                // call deleteStorageFolder recursively
                await deleteStorageFolder(folderRef.fullPath)
                    .catch((error) => {
                        console.error('error on recursive delete: ', error);
                    });
            });
            res.items.forEach(async (itemRef) => {
                // All the items under listRef.
                await deleteObject(itemRef)
                    .catch((error) => {
                        console.error('error deleting the item: ', error);
                    });
            });
        }).catch((error) => {
            console.error('failed to delete folder: ', error);
    });
    
}