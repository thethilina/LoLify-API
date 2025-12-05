import { NextResponse } from "next/server";
import connect from "@/lib/db";
import mongoose from "mongoose";
import Battle from "@/lib/models/battle";

export const GET = async (request: Request, context: any) => {
  try {
    await connect();
    
    // get userId from URL params
    const {searchParams} = new URL(request.url);
    const userId =  searchParams.get("userId");

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // Fetch battles where user participated
    const battles = await Battle.find({
      $or: [{ user_id_by: userId }, { user_id_to: userId }]
    }).sort({ startedTime: -1 }); // optional: latest battles first

    if (!battles || battles.length === 0) {
      return NextResponse.json(
        { message: `No battles found for user ${userId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Battles fetched", battles }, { status: 200 });
  } catch (e: any) {
    console.error("Error fetching battles:", e);
    return NextResponse.json(
      { message: "Error fetching battles", error: e.message },
      { status: 500 }
    );
  }
};
