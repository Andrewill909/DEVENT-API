import multer, { Multer } from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import os from 'os';

cloudinary.v2.config({
  cloud_name: 'diiaqomhc',
  api_key: '449374288675671',
  api_secret: 'RiJtvTX7IDrGt-WRedFgi3-UeMc',
});

//* Singleton
export class CustomMulter {
  public static multerObj: Multer;

  static init() {
    if (!CustomMulter.multerObj) {
      const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2,
        params: async (req, file) => {
          return {
            folder: 'event',
            format: 'jpeg',
          };
        },
      });
      CustomMulter.multerObj = multer({ storage: storage });
    }
    return CustomMulter.multerObj;
  }
}
