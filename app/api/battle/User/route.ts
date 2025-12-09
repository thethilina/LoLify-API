import { NextResponse } from "next/server";
import connect from "@/lib/db";
import mongoose from "mongoose";
import Battle from "@/lib/models/battle";

export const GET = async (request: Request) => {
  try {
    await connect();

    // get userId from URL params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid or missing userId", battles: [] },
        { status: 400 }
      );
    }

    // Fetch battles and populate user details
    const battles = await Battle.find({
      $or: [{ user_id_by: userId }, { user_id_to: userId }],
    })
      .populate("user_id_by", "username avatar")
      .populate("user_id_to", "username avatar")
      .populate("winner", "username avatar")
      .sort({ startedTime: -1 });

    // Return empty array instead of 404 if no battles
    if (!battles || battles.length === 0) {
      return NextResponse.json({ message: "No battles found", battles: [] }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Battles fetched", battles },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error fetching battles:", e);
    return NextResponse.json(
      { message: "Error fetching battles", battles: [], error: e.message },
      { status: 500 }
    );
  }
};
