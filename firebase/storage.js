/*  
Handle the cloud storage management
*/
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
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