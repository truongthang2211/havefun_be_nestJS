import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PromotionsService } from './promotions.service';

@Controller('api/promotions')
export class PromotionsController {
  constructor(private promotionService: PromotionsService) {}

  @Get()
  GetPromotion() {
    return this.promotionService.GetPromotions();
  }
  @Post('create')
  @UseInterceptors(FileInterceptor('img'))
  CreatePromotion(@Body() body, @UploadedFile() file: Express.Multer.File) {
    const JSdata = JSON.parse(body.data);
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
