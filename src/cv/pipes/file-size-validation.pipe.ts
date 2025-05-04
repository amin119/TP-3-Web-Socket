import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oneMb = 1 * 1024 * 1024;
    if (value.size > oneMb) {
      throw new BadRequestException(
        'Le fichier dépasse la taille autorisée (1 Mo)',
      );
    }
    return value;
  }
}
