import { connectToDb, getDb } from "../config/db.js";
import bcrypt from "bcryptjs";

async function runMigration() {
  try {
    await connectToDb();
    const db = await getDb();
    const companiesCollection = db.collection("admin-users");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const newUser = {
      firstName: "sunil",
      email: "sunil@gmail.com",
      role: "company-admin",
      password: "$2b$10$CiZ.xQoaKgJgpQdg3z0S1uFoyLzDgvEpPQ8u6QAJln53XmGp5ncKO",
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