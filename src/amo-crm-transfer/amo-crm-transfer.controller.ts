import { Controller, Get, Query } from "@nestjs/common";
import { AmoCrmTransferService } from "amo-crm-transfer/amo-crm-transfer.service";

@Controller("amo-crm-transfer")
export class AmoCrmTransferController {

  constructor(
    private readonly amoCrmTransferService: AmoCrmTransferService
  ) {
  }

  @Get("contact")
  async contact(
    @Query("name") name: string,
    @Query("email") email: string,
    @Query("phone") phone: string) {
    return this.amoCrmTransferService.addLead(name, email, phone);
  }
}
