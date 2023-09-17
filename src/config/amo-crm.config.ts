import { registerAs } from "@nestjs/config";

export default registerAs("amo-crm-transfer", () => ({
  secretKey: process.env.AMO_CRM_SECRET_KEY,
  integrationID: process.env.AMO_CRM_INTEGRATION_ID,
  authorizationCode: process.env.AMO_CRM_AUTHORIZATION_CODE,
  apiUrl: process.env.AMO_CRM_URL,
  redirectUri: process.env.AMO_CRM_REDIRECT_URI,
}));