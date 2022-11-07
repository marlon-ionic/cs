import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadModule } from '@cs/feature-api-upload';

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './api-uploaded')
  },
  filename: ( _req, file, cb) => {
    const fn = `${uuidv4().replaceAll('-', '')}${path.extname(file.originalname)}`
    cb(null, fn);
  }
})
@Module({
  imports: [
    MulterModule.register({
      storage
    }),
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
