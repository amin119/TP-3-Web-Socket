import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileExtensionValidationPipe implements PipeTransform {
  transform(value: any) {
    const allowedExtensions = /jpg|jpeg|png/;
    const ext = extname(value.originalname).toLowerCase();

    if (!allowedExtensions.test(ext)) {
      throw new BadRequestException(
        'Seules les images JPEG, JPG et PNG sont autorisées.',
      );
    }

    return value;
  }
}
