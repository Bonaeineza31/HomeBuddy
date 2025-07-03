import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'dfe2mhh7v',
  api_key: '575364547858532',
  api_secret: 'o0SsnDZ-BKtxmiPoAgIk7i25Zsw'
});

export default cloudinary;
