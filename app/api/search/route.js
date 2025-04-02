import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  const uri =
    "mongodb+srv://Yuvraj--SinghStock:Ktks8f93InNhLG6BwwcNpH@cluster0.djkqg.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");

    const products = await inventory.aggregate([
      {
        $match: {
          $or: [{ slug: { $regex: query, $options: "i" } }],
        },
      },
    ]).toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    await client.close();
  }
}
