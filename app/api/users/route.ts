import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import Frequest from "@/lib/models/FriendRequest";
import mongoose from "mongoose";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    await connect();

    const skip = (page - 1) * limit;

    const currentUser = await User.findById(userId).select("friends");

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const requests = await Frequest.find({
      $or: [
        { byuserid: userId },
        { touserid: userId },
      ],
    }).select("byuserid touserid");

    const excludedIds = new Set<string>();

    excludedIds.add(userId);

    
    currentUser.friends.forEach((id: any) =>
      excludedIds.add(id.toString())
    );

    requests.forEach((req) => {
      excludedIds.add(req.byuserid.toString());
      excludedIds.add(req.touserid.toString());
    });

    const users = await User.find({
      _id: { $nin: Array.from(excludedIds) },
      status: "active",
    })
      .skip(skip)
      .limit(limit)
      .select("-password -email -friends -createdAt -updatedAt -__v");

    return NextResponse.json(users, { status: 200 });

  } catch (e: any) {
    return new NextResponse(
      "Error fetching users: " + e.message,
      { status: 500 }
    );
  }
};
