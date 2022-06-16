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
    return this.hotelService.AddRoom(
      { ...JSdata.room, imgs: [] },
      JSdata.hotel_id,
      files,
    );
  }
  @Delete('deleteroom/:hotel_id/:room_id')
  async DeleteRoom(
    @Param('hotel_id') hotel_id: string,
    @Param('room_id') room_id: string,
  ) {
    return this.hotelService.DeleteRoom(room_id, hotel_id);
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
  @Put('editroom')
  @UseInterceptors(FilesInterceptor('imgs'))
  async EditRoom(
    @Body() Hotel: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const JSdata = JSON.parse(Hotel.data);
    return this.hotelService.EditRoom({ ...JSdata, imgs: [] }, files);
  }
  @Post('addrating')
  async AddRating(@Body() body: any): Promise<any> {
    return this.hotelService.CreateRating(body);
  }
}
