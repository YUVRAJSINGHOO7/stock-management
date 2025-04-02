import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  let { action, slug, initialQuantity } = await request.json();
  console.log(action, slug, initialQuantity);

  const uri =
    "mongodb+srv://Yuvraj--SinghStock:Ktks8f93InNhLG6BwwcNpH@cluster0.djkqg.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");
    const filter = { slug: slug };
    let newQuantity =
      action === "plus"
        ? parseInt(initialQuantity) + 1
        : parseInt(initialQuantity) - 1;
    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };
    const result = await inventory.updateOne(filter, updateDoc, {});
    console.log(result);
    return NextResponse.json({
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      success: true,
    });
  } finally {
    await client.close();
  }
}
