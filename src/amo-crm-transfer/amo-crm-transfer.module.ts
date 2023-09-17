import { Module } from '@nestjs/common';
import { AmoCrmTransferService } from './amo-crm-transfer.service';
import { HttpModule } from "@nestjs/axios";
import { AmoCrmTransferController } from './amo-crm-transfer.controller';

@Module({
  providers: [AmoCrmTransferService],
  imports: [HttpModule],
  controllers: [AmoCrmTransferController]
})
export class AmoCrmTransferModule {

}
