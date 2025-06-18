import { connectToDb, getDb } from "../config/db.js";

async function runMigration() {
  try {
    await connectToDb();
    const db = await getDb();
    const companiesCollection = db.collection('companies');

    // Update for Appsfactory
    await companiesCollection.updateOne(
      { COMPANY_NAME: 'Appsfactory' },
      {
        $set: {
          LearningPlanInteractionPoint: 2,
          CoachingChatInteractionPoint: 1,
          RoleplayInteractionPoint: 5,
          ReflectionInteractionPoint: 5,
        },
      },
    );

    // Update for Doyensys
    await companiesCollection.updateOne(
      { COMPANY_NAME: 'Doyensys' },
      {
        $set: {
          LearningPlanInteractionPoint: 2,
          CoachingChatInteractionPoint: 1,
          RoleplayInteractionPoint: 5,
          ReflectionInteractionPoint: 5,
        },
      },
    );

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

runMigration();


// db.companies.updateOne(
//   { COMPANY_NAME: 'Appsfactory' },
//   {
//     $set: {
//       LearningPlanInteractionPoint: 2,
//       CoachingChatInteractionPoint: 1,
//       RoleplayInteractionPoint: 5,
//       ReflectionInteractionPoint: 5
//     }
//   }
// );

// db.companies.updateOne(
//   { COMPANY_NAME: 'Doyensys' },
//   {
//     $set: {
//       LearningPlanInteractionPoint: 2,
//       CoachingChatInteractionPoint: 1,
//       RoleplayInteractionPoint: 5,
//       ReflectionInteractionPoint: 5
//     }
//   }
// );
