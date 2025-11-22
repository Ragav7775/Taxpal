import mongoose from "mongoose";

const TaxPal_DB = mongoose.connection;

// Connection events
TaxPal_DB.on("connected", () => {
    console.log("✅ Taxpal DataBase connected successfully");
});

TaxPal_DB.on("error", (err) => {
    console.error("❌ Taxpal DataBase connection error:", err);
});

TaxPal_DB.on("disconnected", () => {
    console.warn("⚠️ Taxpal DataBase disconnected");
});

export default TaxPal_DB;
