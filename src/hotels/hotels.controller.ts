import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('imgs'))
  async CreateHotel(
    @Body() Hotel: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const JSdata = JSON.parse(Hotel.data);
    return this.hotelService.CreateHotel(JSdata, files);
  }

  @Post('addroom')
  @UseInterceptors(FilesInterceptor('imgs'))
  async AddRoom(
    @Body() body: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    const JSdata = JSON.parse(body.data);
    return this.hotelService.AddRoom(JSdata.room, JSdata.hotel_id, files);
  }
  @Delete('deleteroom')
  async DeleteRoom(@Body() body) {
    return this.hotelService.DeleteRoom(body.room_id, body.hotel_id);
  }
  @Put('edit')
  @UseInterceptors(FilesInterceptor('imgs'))
  async EditHotel(
    @Body() Hotel: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const JSdata = JSON.parse(Hotel.data);
    return this.hotelService.EditHotel(JSdata, files);
  }
}
