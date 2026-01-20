import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Notification from "@/lib/models/notifications";

export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const touser = searchParams.get("touser");

    if (!touser) {
      return NextResponse.json(
        { success: false, error: "touser is required" },
        { status: 400 }
      );
    }

    const notifications = await Notification.find({ touser })
      .populate("auser", "username avatar")
      .populate("memeid")
      .populate("battleid")
      .populate("challengeReqid")
      .sort({ createdAt: -1 });

    await Notification.updateMany(
      { touser, status: "toShow" },
      { $set: { status: "viewed" } }
    );

    return NextResponse.json({ success: true, data: notifications }, { status: 200 });

  } catch (e: any) {
    console.error("Error fetching notifications:", e);
    return NextResponse.json(
      { success: false, error: "Error fetching notifications", details: e.message },
      { status: 500 }
    );
  }
}
