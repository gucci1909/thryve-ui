import bcrypt from 'bcryptjs';
import { getDb } from '../../config/db.js';
import { ObjectId } from 'mongodb';

export const allCompaniesIDsController = async (req, res) => {
  try {
    const db = getDb();
    const companies = await db
      .collection('companies')
      .find({}, { projection: { COMPANY_NAME: 1, INVITE_CODE: 1, _id: 1 } })
      .toArray();
    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json({
      message: 'Companies retrieved successfully.',
      companies: companies.map((company) => ({
        name: company.COMPANY_NAME,
        invite_code: company.INVITE_CODE,
        _id: company._id.toString(),
      })),
    });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).json({ message: 'Internal server error while retrieving companies.' });
  }
};

export const allCompaniesDetailsController = async (req, res) => {
  try {
    const db = getDb();

    const { search = '', sortBy = 'COMPANY_NAME', sortOrder = 'asc' } = req.query;

    const query = {};

    // If search string provided, filter by company name (case-insensitive)
    if (search) {
      query.COMPANY_NAME = { $regex: search, $options: 'i' };
    }

    const sort = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const companies = await db
      .collection('companies')
      .find(query, {
        projection: {
          _id: 1,
          COMPANY_NAME: 1,
          INVITE_CODE: 1,
          ABOUT_TEXT: 1,
          CoachingChatInteractionPoint: 1,
          LearningPlanInteractionPoint: 1,
          ReflectionInteractionPoint: 1,
          RoleplayInteractionPoint: 1,
          POINTSSTREAKPERDAY: 1,
          status: 1,
        },
      })
      .sort(sort)
      .toArray();

    if (companies.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json({
      message: 'Companies retrieved successfully.',
      companies: companies,
    });
  } catch (error) {
    console.error('Error retrieving companies:', error);
    res.status(500).json({ message: 'Internal server error while retrieving companies.' });
  }
};

export const companyChangePasswordController = async (req, res) => {
  try {
    const db = getDb();
    const { company_id, newPassword } = req.body;

    if (!company_id || !newPassword) {
      return res.status(400).json({ message: 'Invite code and new password are required.' });
    }

    const userCollection = db.collection('admin-users');

    const adminUser = await userCollection.findOne({
      companyId: company_id.toString(),
      role: 'company-admin',
    });

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found for the given company.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await userCollection.updateOne(
      { _id: adminUser._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyDetailByIdController = async (req, res) => {
  try {
    const db = getDb();
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required.' });
    }

    const company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });

    const userCollection = db.collection('admin-users');
    const adminUser = await userCollection.findOne({
      companyId: companyId,
      role: 'company-admin',
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    res.status(200).json({
      message: 'Company details retrieved successfully.',
      company: {
        ...company,
        hr_email: adminUser?.email,
        hr_id: adminUser?._id,
        hr_firstName: adminUser?.firstName,
      },
    });
  } catch (error) {
    console.error('Error retrieving company details:', error);
    res.status(500).json({ message: 'Internal server error while retrieving company details.' });
  }
};

export const companyEditTextController = async (req, res) => {
  try {
    const db = getDb();
    const { company_id, newText } = req.body;

    if (!company_id || !newText) {
      return res.status(400).json({ message: 'Invite code and newText are required.' });
    }

    const companyCollection = db.collection('companies');

    // Update the password
    await companyCollection.updateOne(
      { _id: new ObjectId(company_id) },
      {
        $set: {
          ABOUT_TEXT: newText,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'About Text updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyEditHrEmailController = async (req, res) => {
  try {
    const db = getDb();
    const { user_id, newEmail } = req.body;

    if (!user_id || !newEmail) {
      return res.status(400).json({ message: 'user id and newEmail are required.' });
    }

    const userCollection = db.collection('admin-users');

    // Update the password
    await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email: newEmail,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({ message: 'Email updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error while updating password.' });
  }
};

export const companyChangeStatusController = async (req, res) => {
  try {
    const db = getDb();
    const companyCollection = db.collection('companies');

    const { status } = req.body;
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid company ID format' });
    }

    // Validate status input
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: 'Status must be a boolean value' });
    }

    const company = await companyCollection.findOne({ _id: new ObjectId(id) });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updatedStatus = status ? 'active' : 'inactive';

    const updateResult = await companyCollection.updateOne(
      { _id: company._id },
      { $set: { status: updatedStatus } },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Failed to update user status' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      company: {
        _id: company._id,
        status: updatedStatus,
      },
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
