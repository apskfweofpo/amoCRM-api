import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AmoCrmConfig } from "config/types/interfaces/amo-crm-config.interface";
import { IAmoCrmTokens } from "amo-crm-transfer/types/interfaces/token-amo-crm.interface";

@Injectable()
export class AmoCrmTransferService {
  private readonly amoCrmConfig: AmoCrmConfig;
  private tokens: IAmoCrmTokens;

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {
    this.amoCrmConfig = this.configService.get<AmoCrmConfig>("amo-crm-transfer");
    this.getTokens();
  }

  async getTokens(): Promise<void> {
    try {
      const { data } = await this.httpService.axiosRef.post(`${this.amoCrmConfig.apiUrl}oauth2/access_token`,
        {
          "client_id": this.amoCrmConfig.integrationID,
          "client_secret": this.amoCrmConfig.secretKey,
          "grant_type": "authorization_code",
          "code": this.amoCrmConfig.authorizationCode,
          "redirect_uri": this.amoCrmConfig.redirectUri
        });
      this.tokens = data;
    } catch (e) {
      throw new HttpException(e.response, HttpStatus.BAD_REQUEST)
    }
  }

  async addLead(name: string, email: string, phone: string): Promise<Object> {
    try {
      let contactId = await this.findContactByPhone(phone);

      if (!contactId) {
        contactId = await this.createContact(name, email, phone);
      } else {
        await this.updateContact(name, email, phone, contactId);
      }

      const res = await this.httpService.axiosRef.post(`${this.amoCrmConfig.apiUrl}api/v4/leads`,
        [
          {
            "name": "Тестовая сделка",
            "status_id": 60356858,
            "_embedded": {
              "contacts": [
                { "id": contactId }
              ]
            }
          }
        ],
        { headers: { Authorization: `Bearer ${this.tokens.access_token}` } });

      return res.data._embedded.leads;
    } catch (e) {
      throw new HttpException(e.response.data, HttpStatus.BAD_REQUEST)
    }
  }

  private async createContact(name: string, email: string, phone: string): Promise<number> {
    try {
      const res = await this.httpService.axiosRef.post(`${this.amoCrmConfig.apiUrl}api/v4/contacts`,
        [
          {
            "name": name,
            "custom_fields_values": [
              {
                "field_id": 2184247,
                "values": [
                  {
                    "value": phone
                  }
                ]
              },
              {
                "field_id": 2184249,
                "values": [
                  {
                    "value": email
                  }
                ]
              }
            ]
          }
        ],
        { headers: { Authorization: `Bearer ${this.tokens.access_token}` } });
      return res.data._embedded.contacts[0].id;
    } catch (e) {
      throw new HttpException(e.response.data, HttpStatus.BAD_REQUEST)
    }
  }

  private async updateContact(name: string, email: string, phone: string, id: number) {
    try {
      const res = await this.httpService.axiosRef.patch(`${this.amoCrmConfig.apiUrl}api/v4/contacts/${id}`,
        {
          "id": id,
          "name": name,
          "custom_fields_values": [
            {
              "field_id": 2184247,
              "values": [
                {
                  "value": phone
                }
              ]
            },
            {
              "field_id": 2184249,
              "values": [
                {
                  "value": email
                }
              ]
            }
          ]
        },
        { headers: { Authorization: `Bearer ${this.tokens.access_token}` } });
      return res.data;
    } catch (e) {
      throw new HttpException(e.response.data, HttpStatus.BAD_REQUEST)
    }
  }

  private async findContactByPhone(phone: string): Promise<number> {
    try {
      const res =
        await this.httpService.axiosRef.get
        (`${this.amoCrmConfig.apiUrl}/api/v4/contacts?query=${phone}`,
          { headers: { Authorization: `Bearer ${this.tokens.access_token}` } });

      return res.data._embedded.contacts[0].id;
    } catch (e) {
      throw new HttpException(e.response.data, HttpStatus.BAD_REQUEST)
    }
  }
}
