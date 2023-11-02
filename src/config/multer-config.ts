import { diskStorage } from 'multer';
import { extname } from 'path';
import { STORGE_PATH } from '.';

export const storage = diskStorage({
    destination: `./${STORGE_PATH}`,
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    }
  });
  
  function generateFilename(file) {
    return `${Date.now()}${extname(file.originalname)}`;
  }