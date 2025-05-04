import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'cv', version: '2' })
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}
  @Get()
  findAll(@User() user) {
    return this.cvService.findAllv2(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOnev2(+id);
  }

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const user = req.user as { id: number };
    if (!user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.cvService.createv2(createCvDto, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCvDto, @Req() req: Request) {
    const userId = (req['user'] as { id: number }).id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('REQ USER:', req['user']);
    return this.cvService.updatev2(+id, updateCvDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req['user'] as { id: number }).id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('REQ USER:', req['user']);
    return this.cvService.removev2(+id, userId.toString());
  }
}
