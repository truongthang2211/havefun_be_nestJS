import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Timestamp } from 'firebase/firestore';
import Order from 'src/dto/Order';
import ICreateOrder from 'src/interfaces/ICreateOrder';
import IOrder from 'src/interfaces/IOrder';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @Get('hotel/:id')
  async GetOrderByHotel(@Param('id') id: string) {
    return this.orderService.GetOrderByHotel(id);
  }
  @Get('user/:id')
  async GetOrderByUser(@Param('id') id: string) {
    return this.orderService.GetOrderByUser(id);
  }
  @Post('create')
  async CreateOrder(@Body() body: ICreateOrder) {
    body.order_start = new Timestamp(
      body.order_start.seconds,
      body.order_start.nanoseconds,
    );
    body.order_end = new Timestamp(
      body.order_end.seconds,
      body.order_end.nanoseconds,
    );
    return this.orderService.CreateOrder(body);
  }
  @Put('update')
  async UpdateOrder(@Body() body: IOrder) {
    return this.orderService.EditOrder(body);
  }
}
