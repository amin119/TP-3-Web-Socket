import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FiltreCvDto } from './dto/filtre-cv.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { FileSizeValidationPipe } from './pipes/file-size-validation.pipe';
import { FileExtensionValidationPipe } from './pipes/file-extension-validation.pipe';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }

  @Get()
  async findAll(
    @Query() filter: FiltreCvDto,
    @Query() pagination: PaginationDto,
  ) {
    if (filter.critere || filter.age !== undefined) {
      // Return filtered results WITHOUT pagination
      return this.cvService.findWithFilters(filter);
    }
    // Return non-filtered results WITH pagination
    return this.cvService.findAll(pagination);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only Images are allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return { message: 'Aucune image uploadée.' };
    }
    const imagePath = file.path;
    await this.cvService.updateImage(+id, imagePath);
    return { message: 'Image uploadée avec succès.', path: imagePath };
  }

  @Get(':id/image')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const cv = await this.cvService.findOne(+id);
    if (!cv || !cv.path) {
      return res.status(404).json({ message: 'Image non trouvée.' });
    }
    const fullPath = path.resolve(cv.path);
    return res.sendFile(fullPath);
  }

  @Delete(':id/image')
  async deleteImage(@Param('id') id: string) {
    const cv = await this.cvService.findOne(+id);
    if (cv?.path && fs.existsSync(cv.path)) {
      fs.unlinkSync(cv.path);
    }
    await this.cvService.updateImage(+id, '');
    return { message: 'Image supprimée.' };
  }
  @Post('create-with-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only Images are allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
  )
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCvDto: CreateCvDto,
  ) {
    const newCv = await this.cvService.create(createCvDto);
    if (file) {
      const imagePath = file.path;
      await this.cvService.updateImage(newCv.id, imagePath);
    }

    return {
      message: 'CV créé' + (file ? ' avec image.' : '.'),
      cv: newCv,
    };
  }
  @Patch(':id/update-with-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new Error('Only Images are allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    }),
  )
  async updateWithImage(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException('CV non trouvé');
    }

    const updatedCv = await this.cvService.update(+id, updateCvDto);

    if (file) {
      const imagePath = file.path;
      await this.cvService.updateImage(+id, imagePath);
    }

    return {
      message:
        'CV mis à jour avec succès.' + (file ? ' Image mise à jour.' : ''),
      cv: updatedCv,
    };
  }
  // this is another upload image using the pipes to validate the image
  @Post(':id/upload-with-pipes')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadImageWithValidation(
    @Param('id') id: string,
    @UploadedFile(FileSizeValidationPipe, FileExtensionValidationPipe)
    file: Express.Multer.File,
  ) {
    if (!file) {
      return { message: 'Aucune image uploadée.' };
    }
    const imagePath = file.path;
    await this.cvService.updateImage(+id, imagePath);
    return {
      message: 'Image uploadée avec succès et validée.',
      path: imagePath,
    };
  }
}
