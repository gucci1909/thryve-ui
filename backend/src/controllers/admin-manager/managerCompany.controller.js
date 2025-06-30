import { getDb } from "../../config/db.js";

export const adminCompanyDetails = async (req, res) => {
  try {
    const db = getDb();
    const companiesCollection = db.collection('companies');

    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    const companyDetails = await companiesCollection.findOne({ INVITE_CODE: companyId });

    return res.json({
      companyDetails: {
        ...companyDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
