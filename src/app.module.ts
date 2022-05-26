import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsModule } from './hotels/hotels.module';
import { UsersModule } from './users/users.module';
import { PromotionsService } from './promotions/promotions.service';
import { PromotionsController } from './promotions/promotions.controller';
import { PromotionsModule } from './promotions/promotions.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { HotelusersModule } from './hotelusers/hotelusers.module';

@Module({
  imports: [HotelsModule, UsersModule, PromotionsModule, OrdersModule, HotelusersModule],
  controllers: [AppController, PromotionsController, OrdersController],
  providers: [AppService, PromotionsService, OrdersService],
})
export class AppModule {}
