import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import crypto from 'crypto';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

function generateInviteCode(companyName) {
  const hash = crypto.createHash('md5').update(companyName).digest('hex').toUpperCase();
  return `MD5-${hash.slice(0, 3)}-${hash.slice(-3)}`;
}

export const companiesController = async (req, res) => {
  try {
    const db = await getDb();
    const companiesCollection = db.collection('companies');

    const companies = [
      {
        COMPANY_NAME: 'Appsfactory',
        INVITE_CODE: generateInviteCode('Appsfactory'),
        ABOUT_TEXT: `oiuhj`
      },
      {
        COMPANY_NAME: 'Doyensys',
        INVITE_CODE: generateInviteCode('Doyensys'),
        ABOUT_TEXT: `to creating a high-trust, high-performance culture`
      },
    ];

    await companiesCollection.insertMany(companies);

    res.status(201).json({ message: 'Companies inserted successfully', companies });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ error: 'Failed to insert companies' });
  }
};

export const companyVerifyKeyController = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const db = await getDb();
    const companiesCollection = db.collection('companies');

    const company = await companiesCollection.findOne({ INVITE_CODE: inviteCode });

    if (!company) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    res.status(200).json({
      success: true,
      company: {
        name: company.COMPANY_NAME,
        aboutText: company.ABOUT_TEXT,
        inviteCode: company.INVITE_CODE,
      },
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify invite code' });
  }
};
