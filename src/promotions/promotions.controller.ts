import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Timestamp } from 'firebase/firestore';
import { get } from 'http';
import IPromotion from 'src/interfaces/IPromotions';
import { PromotionsService } from './promotions.service';

@Controller('api/promotions')
export class PromotionsController {
  constructor(private promotionService: PromotionsService) {}

  @Get()
  GetPromotion() {
    return this.promotionService.GetPromotions();
  }
  @Get(':id')
  GetPromotionByHotel(@Param('id') id: string) {
    return this.promotionService.GetPromotionByHotel(id);
  }
  @Post('create')
  @UseInterceptors(FileInterceptor('img'))
  CreatePromotion(@Body() body, @UploadedFile() file: Express.Multer.File) {
    const JSdata: IPromotion = JSON.parse(body.data);
    JSdata.time_start = new Timestamp(
      JSdata.time_start.seconds,
      JSdata.time_start.nanoseconds,
    );
    JSdata.time_end = new Timestamp(
      JSdata.time_end.seconds,
      JSdata.time_end.nanoseconds,
    );
    return this.promotionService.CreatePromotion(JSdata, file);
  }
  @Put('edit')
  @UseInterceptors(FileInterceptor('img'))
  EditPromotion(@Body() body, @UploadedFile() file: Express.Multer.File) {
    const JSdata = JSON.parse(body.data);
    return this.promotionService.EditPromotion(JSdata, file);
  }
  @Delete('delete')
  Deleteromotion(@Body() body) {
    return this.promotionService.DeletePromotion(
      body.hotel_id,
      body.promotion_id,
    );
  }
}
