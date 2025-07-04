import { connectToDb, getDb } from "../config/db.js";

async function addStatusFieldMigration() {
  try {
    await connectToDb();
    const db = await getDb();
    const companiesCollection = db.collection("companies");

    // Update documents where 'status' field is missing
    const result = await companiesCollection.updateMany(
      { status: { $exists: false } },
      [
        {
          $set: {
            status: "active"
          }
        }
      ]
    );

    console.log(`Modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

addStatusFieldMigration();