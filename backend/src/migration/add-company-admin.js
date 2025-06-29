import { connectToDb, getDb } from "../config/db.js";
import bcrypt from "bcryptjs";

async function runMigration() {
  try {
    await connectToDb();
    const db = await getDb();
    const companiesCollection = db.collection("admin-users");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const newUser = {
      firstName: "umang",
      email: "umangarora0134@gmail.com",
      role: "company-admin",
      password: hashedPassword,
      companyId: "MD5-9CC-4D8",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await companiesCollection.insertOne(newUser);

    console.log("Migration completed successfully:", result.insertedId);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit();
  }
}

runMigration();