import {
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as AWS from 'aws-sdk';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadsModuleOptions } from './uploads.interface';
import { Args } from '@nestjs/graphql';

const BUCKET_NAME = 'zigbangclones3';

@Controller('uploads')
export class UploadsController {
  constructor(@Inject(CONFIG_OPTIONS) private readonly options: UploadsModuleOptions) {}
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files, @Req() request: Request) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretKey,
      },
    });
    try {
      const imagesPath = [];
      await Promise.all(
        files.map(async file => {
          const objectName = `items/${request.body.id}/${file.originalname}`;
          const params = {
            Body: file.buffer,
            Bucket: BUCKET_NAME,
            Key: objectName,
            ACL: 'public-read',
          };
          await new AWS.S3().putObject(params).promise();
          const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
          imagesPath.push(url);
        }),
      );

      return { imagesPath };
    } catch (error) {
      return null;
    }
  }
  @Put('/updates')
  @UseInterceptors(FilesInterceptor('files'))
  async updateFile(@UploadedFiles() files, @Req() request: Request) {
    const deleteImages = JSON.parse(request.body.deleteImages);
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretKey,
      },
    });
    try {
      const s3 = new AWS.S3();

      if (deleteImages) {
        const str = deleteImages;
        const result = str.reduce((acc, cur) => {
          acc.push(cur.replace('https://zigbangclones3.s3.amazonaws.com/', ''));
          return acc;
        }, []);
        console.log(`result:${result}`);
        result.map(async e => {
          const params = {
            Bucket: BUCKET_NAME,
            Prefix: e, // 사용자 버켓 이름
            // 버켓 내 경로
          };
          const listedObjects = await s3.listObjectsV2(params).promise();

          const deleteParams = {
            Bucket: params.Bucket,
            Delete: { Objects: [] },
          };

          listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
          });

          await s3.deleteObjects(deleteParams).promise();
        });
      }
      if (files) return await this.uploadFile(files, request);
      return [];
    } catch (error) {
      return error;
    }
  }
  //업로드 이미지 삭제
  @Delete('/delete/:s3Code')
  async deleteFile(@Param('s3Code') s3Code: string) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.accessKey,
        secretAccessKey: this.options.secretKey,
      },
    });
    try {
      const s3 = new AWS.S3();

      const param = {
        Bucket: BUCKET_NAME,
        Prefix: `items/${s3Code}`, // 사용자 버켓 이름
        // 버켓 내 경로
      };
      const listedObjects = await s3.listObjectsV2(param).promise();

      const deleteParams = {
        Bucket: param.Bucket,
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await s3.deleteObjects(deleteParams).promise();
      return {
        ok: true,
      };
    } catch (error) {
      return error;
    }
  }
}
