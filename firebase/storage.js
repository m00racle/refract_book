/*  
Handle the cloud storage management
*/
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImageToStorage(file, filePath, fileType) {
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file, {
        contentType: `image/${fileType}`,
    });
}