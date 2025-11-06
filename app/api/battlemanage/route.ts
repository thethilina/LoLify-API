import Battle from "@/lib/models/battle";
import BattleRequest from "@/lib/models/battleRequest";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { setnotifi } from "@/lib/models/notifications";
import connect from "@/lib/db";


export const PATCH = async (request: Request) => {
  try {
    const time = new Date();

    await connect();

    const battles = await Battle.find({
      endTime: { $lte: time },
      status: "onGoing"
    });

    if (battles.length === 0) {
      return new NextResponse("No battles to check", { status: 202 });
    }

    for (const battle of battles) {
      const battleId = battle._id;
      const user1vote = battle.vote_user_1.length;
      const user2vote = battle.vote_for_user_2.length;
      const user1 = battle.user_id_by;
      const user2 = battle.user_id_to;

      if (user1vote > user2vote) {
        await Battle.findByIdAndUpdate(battleId, {
          status: "isCompleted",
          winner: user1
        });

        setnotifi(user1, user2, "battleend", battleId);
        setnotifi(user2, user1, "battleend", battleId);

      } else if (user1vote < user2vote) {
        await Battle.findByIdAndUpdate(battleId, {
          status: "isCompleted",
          winner: user2
        });

        setnotifi(user1, user2, "battleend", battleId);
        setnotifi(user2, user1, "battleend", battleId);

      } else {
        await Battle.findByIdAndUpdate(battleId, {
          status: "Draw"
        });

        setnotifi(user1, user2, "battleend", battleId);
        setnotifi(user2, user1, "battleend", battleId);
      }
    }

    return new NextResponse("Battles checked and updated!", { status: 200 });

  } catch (e: any) {
    return new NextResponse("Error updating battle: " + e.message, {
      status: 500
    });
  }
};
