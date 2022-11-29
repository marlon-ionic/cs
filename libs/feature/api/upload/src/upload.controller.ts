import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'jsonFile', maxCount: 1 },
    ])
  )
  @Post()
  uploadFile(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: any,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; jsonFile?: Express.Multer.File[] }
  ) {
    if (
      request.cookies['key'] === null ||
      request.cookies['key'] === undefined ||
      request.cookies['key'] === ''
    ) {
      console.log(request.cookies);
      throw new HttpException('Missing key cookie!', HttpStatus.FORBIDDEN);
    } else {
      response.cookie('serverkey', uuidv4());
    }
    console.log('files', files);
    let bodyResponse = body;
    let uploadedJson;
    if(files?.jsonFile?.length > 0) {
      const f = files?.jsonFile[0];
      uploadedJson = {
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      }
      bodyResponse = {...{jsonFile: uploadedJson}, ...bodyResponse};
    }
    let uploadedImage;
    if(files?.image?.length > 0) {
      const f = files?.image[0];
      uploadedImage = {
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      }
      bodyResponse = {...{image: uploadedImage}, ...bodyResponse};
    }
    return {
      uploadedJson,
      uploadedImage,
      body: bodyResponse,
      cookies: request.cookies,
    };
  }

  @Get()
  getUploadKeys(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const id = uuidv4();
    response.cookie('httponlykey', uuidv4(), { httpOnly: true });
    response.cookie('getkey', id, { httpOnly: false });
    return {
      id,
      reqCookies: request.cookies,
    };
  }
}
