import connect from "@/lib/db";
import ReportUser from "@/lib/models/reportUser";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import User from "@/lib/models/users";



//report a user 
export const POST = async(request:Request) => {
    try {
        const {user_id_by,user_id_to,body} = await request.json();
        const loggeduserid = request.headers.get("loggeduserid");

        await connect();

        if(!user_id_by || !user_id_to || !body){
            return new NextResponse(
                JSON.stringify({message:"All the fields should be required!"}),{status:400}
            );
        }

        if(!mongoose.Types.ObjectId.isValid(user_id_by) || !mongoose.Types.ObjectId.isValid(user_id_to)){
            return new NextResponse(
                JSON.stringify({message:"request Fields not found! "}),{status:404}
            );
        }

        if(!loggeduserid || loggeduserid === ""){
            return new NextResponse(
                JSON.stringify({message:"user unautherized!"}),{status:401}
            );
        }

        if(loggeduserid !== user_id_by){
            return new NextResponse(
                JSON.stringify({message:"Unautherized Reporter!"}),{status:403}
            );
        }


        const report = new ReportUser({user_id_by,user_id_to,body,status:"pending"});

        await report.save();

        return new NextResponse(
            JSON.stringify({message:"user reported successfully!",report}),
            {status:200}
        );



    } catch (e:any) {
     return new NextResponse(
        JSON.stringify({message:"Error when Reporting a user!",error:e.message}),{status:500}
        );
    }
}

//get all the user reported
export const GET = async (requset:Request) => {
    try {
        await connect();

        const reports = await ReportUser.find();
           

        if(!reports ||  reports.length === 0){
            return new NextResponse(
                JSON.stringify({message:"No reports found"}),{status:404}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Report users fetched successfully!",reports}),{status:200}
        );

        
        
    } catch (e:any) {
        console.error("Error fetching Report users!",e)
        return new NextResponse(
        JSON.stringify({message:"Error in fetching report users!",error:e.message}),{status:500}
    )
    }
}