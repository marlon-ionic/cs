import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import 'multer';

@Controller('upload')
export class UploadController {

  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'jsonFile', maxCount: 1 },
  ]))
  @Post()
  uploadFile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: any,
    @UploadedFiles() files: { image?: Express.Multer.File[], jsonFile?: Express.Multer.File[] }) {
    if(request.cookies['key'] === null || request.cookies['key'] === undefined || request.cookies['key'] === '') {
      throw new HttpException('Missing key cookie!', HttpStatus.FORBIDDEN);
    } else {
      response.cookie('serverkey', uuidv4());
    }
    console.log('files', files);
    return {
      body,
      cookies: request.cookies
    };
  }
}
