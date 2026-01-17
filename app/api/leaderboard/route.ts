import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {

await connect();

      const top3 = await User.find({ status: "active" })
      .sort({ orbs: -1 })
      .limit(3)
      .select("username avatar orbs");

const top10 = await User.find({ status: "active" })
      .sort({ orbs: -1 })
      .limit(10)
      .select("username avatar orbs");
    await connect();

     return NextResponse.json(
      {
        success: true,
        top3,
        top10,
      },
      { status: 200 }
    );

  
  } catch (e: any) {
    return new NextResponse("Error in fetching meme" + e.message, {
      status: 500,
    });
  }
};
