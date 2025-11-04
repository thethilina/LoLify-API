import connect from "@/lib/db"
import ReportMeme from "@/lib/models/reportMeme";
import { NextResponse } from "next/server"
import Meme from "@/lib/models/meme";
import mongoose from "mongoose";

export const GET = async (request:Request,context:{params : Promise<{memeId : string}>}) => {
    try {
        await connect();

        const {memeId} = await context.params;
        const reports = await ReportMeme.find({meme_id : memeId})

        if(!reports ){
            return new NextResponse(
                JSON.stringify({message:"Report not found!"}),{status:404}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Report found!",reports}),{status:200}
        );


    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error when fetch reported meme from memeId"}),{status:500}
        )
    }
}

//updating reported meme with actions


export const PATCH = async (request:Request,context:{params: Promise<{memeId:string}>}) => {
    try {
    await connect();

    const {memeId} = await context.params;
    const {status , memeAction} = await request.json();
    const cleanId = memeId.trim();

    //updating report status
        const report = await ReportMeme.findOneAndUpdate(
           {memeId: new mongoose.Types.ObjectId(cleanId) },
            {status},
            {new:true}
        );

        if(!report){
            return new NextResponse(
                JSON.stringify({message:"Reported meme not found!"}),{status:404}
            );
        }

        //taking action

     let memeUpdateResult = null;

    if (memeAction) {
      switch (memeAction) {
        case "hide":
          memeUpdateResult = await Meme.findByIdAndUpdate(
            report.meme_id,
            { isHidden: true },
            { new: true }
          );
          break;

        case "delete":
          memeUpdateResult = await Meme.findByIdAndUpdate(
             report.meme_id,
            { status: "deleted" },
            { new: true }
        );

          break;

        default:
          return new NextResponse(
            JSON.stringify({ message: "Invalid memeAction" }),
            { status: 400 }
          );
      }
    }

    return new NextResponse(
      JSON.stringify({
        message: "Report and meme updated successfully",
        report,
        memeUpdateResult,
      }),
      { status: 200 }
    );

    } catch (e:any) {
    return new  NextResponse(
        JSON.stringify({message:"Error when updating report memes!",error:e.message}),{status:500}
    );
    }
}