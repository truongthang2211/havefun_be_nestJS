import { Module } from '@nestjs/common';
import { HotelusersService } from './hotelusers.service';
import { HotelusersController } from './hotelusers.controller';

@Module({
  providers: [HotelusersService],
  controllers: [HotelusersController]
})
export class HotelusersModule {}
