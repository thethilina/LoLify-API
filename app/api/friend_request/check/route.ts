import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import Frequest from "@/lib/models/FriendRequest";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const targetUserId = searchParams.get("targetUserId");
    const loggeduserid = request.headers.get("loggeduserid");

    if (!userId || !targetUserId) {
      return NextResponse.json(
        { message: "missing userId or targetUserId" },
        { status: 400 }
      );
    }

    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(targetUserId)
    ) {
      return NextResponse.json(
        { message: "invalid user id" },
        { status: 400 }
      );
    }

    if (userId !== loggeduserid) {
      return NextResponse.json(
        { message: "unauthorized" },
        { status: 401 }
      );
    }

    await connect();

    const user = await User.findById(userId).select("friends");

    if (!user) {
      return NextResponse.json(
        { message: "user not found" },
        { status: 404 }
      );
    }


    const isFriend = user.friends.some(
      (id: any) => id.toString() === targetUserId
    );

    if (isFriend) {
      return NextResponse.json({
        status: "friends",
        requestId: null,
      });
    }


    const sentReq = await Frequest.findOne({
      byuserid: userId,
      touserid: targetUserId,
    });

    if (sentReq) {
      return NextResponse.json({
        status: "request_sent",
        requestId: sentReq._id.toString(),
      });
    }

   
    const receivedReq = await Frequest.findOne({
      byuserid: targetUserId,
      touserid: userId,
    });

    if (receivedReq) {
      return NextResponse.json({
        status: "request_received",
        requestId: receivedReq._id.toString(),
      });
    }

    return NextResponse.json({
      status: "none",
      requestId: null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: "error checking relationship " + e.message },
      { status: 500 }
    );
  }
};
