import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IHotel } from 'src/interfaces/IHotel';
import IRoom from 'src/interfaces/IRoom';
import { HotelsService } from './hotels.service';

@Controller('api/hotels')
export class HotelsController {
  constructor(private hotelService: HotelsService) {}
  @Get()
  async GetHotels() {
    return this.hotelService.GetHotels();
  }
  @Get(':id')
  async GetHotelById(@Param('id') id: string) {
    return this.hotelService.GetHotelsById(id);
  }
  @Post('create')
  async CreateHotel(@Body() Hotel: IHotel): Promise<any> {
    return this.hotelService.CreateHotel(Hotel);
  }
  @Post('addroom')
  async AddRoom(@Body() body: any): Promise<any> {
    return this.hotelService.AddRoom(body.room, body.hotel_id);
  }
}
