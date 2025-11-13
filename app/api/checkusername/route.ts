import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/models/users";
import connect from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ message: "Username not found" }, { status: 400 });
    }

    await connect();

    const user = await User.findOne({ username });

    if (user) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }

    return NextResponse.json({ message: "available" }, { status: 200 });

  } catch (e: any) {
    return new NextResponse("Error checking username: " + e.message, { status: 500 });
  }
};
