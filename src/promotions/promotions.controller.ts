import { Controller, Get } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('api/promotions')
export class PromotionsController {
  constructor(private promotionService: PromotionsService) {}

  @Get()
  GetPromotion() {
    return this.promotionService.GetPromotions();
  }
}
