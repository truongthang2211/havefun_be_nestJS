import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import ICreateOrder from 'src/interfaces/ICreateOrder';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @Get(':id')
  async GetHotelById(@Param('id') id: string) {
    return this.orderService.GetOrderByHotel(id);
  }
  @Post('create')
  async CreateOrder(@Body() body: ICreateOrder) {
    return this.orderService.CreateOrder(body);
  }
}
