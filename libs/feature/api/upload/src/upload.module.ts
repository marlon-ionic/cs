import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    console.log('diskStorage.destination', _file);
    cb(null, './api-uploaded')
  },
  filename: ( _req, file, cb) => {
    const fn = `${uuidv4().replace('-', '')}${path.extname(file.originalname)}`
    console.log('diskStorage.destination', fn, file);
    cb(null, fn);
  }
})
@Module({
  imports: [
    MulterModule.register()
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports:  [UploadService],
})
export class UploadModule {}
