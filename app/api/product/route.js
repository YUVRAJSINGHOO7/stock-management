import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri =
    "mongodb+srv://YuvrajSingh:r9ulZ8YUX5fjk9Hy@stock.ee6nd.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");

    const query = {};
    const products = await inventory.find(query).toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  let body = await request.json();
  console.log("Received body:", body);

  const uri =
    "mongodb+srv://YuvrajSingh:r9ulZ8YUX5fjk9Hy@stock.ee6nd.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-management");
    const inventory = database.collection("inventory");
    const product = await inventory.insertOne(body);
    console.log("Inserted product:", product);
    return NextResponse.json({ product, ok: true });
  } finally {
    await client.close();
  }
}

//YuvrajSingh r9ulZ8YUX5fjk9Hy
