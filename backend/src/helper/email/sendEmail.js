import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

// Configure API key
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const from = {
  name: process.env.EMAIL_FROM_NAME || "Thryve",
  email: process.env.EMAIL_FROM_ADDRESS
};

export const sendEmail = async (to, subject, emailBody) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = emailBody;
    sendSmtpEmail.sender = from;
    sendSmtpEmail.to = [{ email: to.email, name: to.name }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Email sent to ' + to.email + '. Returned data: ' + JSON.stringify(data));
    return { success: true, data };
  } catch (error) {
    console.error('API returned error. Email to ' + to.email + '. Error: ' + JSON.stringify(error.response?.body || error));
    return { success: false, error };
  }
}; 