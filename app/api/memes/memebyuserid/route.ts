import connect from "@/lib/db";
import Meme from "@/lib/models/meme";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");
    console.log(`user id: ${userId}`);

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    await connect();

    const objectId = new mongoose.Types.ObjectId(userId);

    const memes = await Meme.find({ userid: objectId });

    if (!memes || memes.length === 0) {
      return new NextResponse("User hasn't uploaded any memes", {
        status: 400,
      });
    }

    return NextResponse.json(memes, { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse("Error fetching memes by userId", { status: 500 });
  }
};
