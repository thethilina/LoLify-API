import connect from "@/lib/db";
import Battle from "@/lib/models/battle";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const battles = await Battle.find({
      $or: [{ user_id_by: userId }, { user_id_to: userId }],
    })
      .populate("user_id_by", "username avatar")
      .populate("user_id_to", "username avatar")
      .populate("winner", "username avatar")
      .sort({ createdAt: -1 });

    if (!battles.length) {
      return NextResponse.json(
        { message: "No battles found", data: [] },
        { status: 200 }
      );
    }

 
    const formattedBattles = battles.map((battle) => {
      const isUserStarter =
        battle.user_id_by._id.toString() === userId;

      const opponent = isUserStarter
        ? battle.user_id_to
        : battle.user_id_by;

      let result = "Draw";
      if (battle.winner) {
        result =
          battle.winner._id.toString() === userId ? "Win" : "Loss";
      }

      return {
        _id: battle._id,
        date: battle.startedTime,
        status: battle.status,
        result,
        opponent: {
          _id: opponent._id,
          username: opponent.username,
          avatar: opponent.avatar,
        },
      };
    });

    return NextResponse.json(
      { message: "Battles found!", data: formattedBattles },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching battles", error: error.message },
      { status: 500 }
    );
  }
};
