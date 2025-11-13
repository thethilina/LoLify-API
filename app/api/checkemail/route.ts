import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/models/users";
import connect from "@/lib/db";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    await connect();

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ message: "Email is already signed" }, { status: 400 });
    }

    return NextResponse.json({ message: "available" }, { status: 200 });

  } catch (e: any) {
    return new NextResponse("Error checking email: " + e.message, { status: 500 });
  }
};
