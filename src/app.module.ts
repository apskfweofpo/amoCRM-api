import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AmoCrmTransferModule } from "./amo-crm-transfer/amo-crm-transfer.module";
import AppConfig from "./config/app.config";
import AmoCrmConfig from "./config/amo-crm.config";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.${process.env.NODE_ENV}.env`,
    load: [AppConfig, AmoCrmConfig]
  }), AmoCrmTransferModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
