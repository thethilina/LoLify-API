import ReportMeme from "@/lib/models/reportMeme";
import mongoose from "mongoose";
import connect from "@/lib/db";
import { NextResponse } from "next/server";

//create meme report
export const POST = async (request:Request) => {
    try {
        const {user_id_reporter , meme_id, body} = await request.json();
    const loggeduserid = request.headers.get("loggeduserid");

    await connect();

    if(!user_id_reporter || !meme_id || !body){
        return new NextResponse(
            JSON.stringify({message:"All the Fields required!"}),{status:400}
        );
    }
    
    if(!mongoose.Types.ObjectId.isValid(user_id_reporter) || !mongoose.Types.ObjectId.isValid(meme_id)){
        return new NextResponse(
            JSON.stringify({message:"Fields not found!"}),{status:404}
        );
    }

    if(!loggeduserid || loggeduserid === ""){
        return new NextResponse(
            JSON.stringify({message:"user Unautherize!"}),{status:401}
        );
    }


    if(loggeduserid !== user_id_reporter){
        return new NextResponse(
            JSON.stringify({message:"Invalid user"}),{status:400}
        );
    }


    const report = new ReportMeme({user_id_reporter,meme_id,body,status:"pending"});

    await report.save();


    return new NextResponse(
        JSON.stringify({message:"successfully reported the meme!",report}),{status:200}
    );




    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error when Creating report to meme",error:e.message}),{status:500}
        );
    }
}

//Get all the meme reports

export const GET =async (request:Request) => {
    try {
        await connect();
        const report = await ReportMeme.find()

        if(!report){
            return new NextResponse(
                JSON.stringify({message:"no reported memes found"}),{status:404}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Reported memes found!",report}),{status:200}
        );




    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error Fetching report memes",error:e.message}),{status:500}
        );
    }
}