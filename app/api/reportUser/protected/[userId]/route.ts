import connect from "@/lib/db";
import ReportUser from "@/lib/models/reportUser";
import User from "@/lib/models/users";
import { promises } from "dns";
import mongoose from "mongoose";
import { NextResponse } from "next/server"

//fetch a singel reported user
export const GET = async (request : Request,context : {params: Promise<{userId : string}> }) => {
    try {
        await connect();

        const {userId} = await context.params;
        
        const reports = await ReportUser.find({user_id_to : userId});

        if(reports.length === 0){
            return new NextResponse(
                JSON.stringify({message:"no reports found for this user"}),{status:404}
            );
        }

        return new NextResponse(
            JSON.stringify(reports),{status:200}
        );

    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error Fetching report users from a user"}),{status:500}
        );
    }
}


//update action user by id


export const PATCH = async(request:Request,context:{params:Promise<{userId:string}>}) => {
    try {
        await connect();

        const {userId} = await context.params;
        const {action} = await request.json();

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:"Reported user not found in db"}),{status :404}
            );
        }

        const reports = await ReportUser.find({user_id_to : userId});

        if(!reports || reports.length === 0){
            return new NextResponse(
                JSON.stringify({message:"Report not found for this user!"}),{status:404}
            );
        }
        

        if(action === "ban" ){
            await User.findByIdAndUpdate(userId,{status:"banned"});
            return new NextResponse(
                JSON.stringify({message:"Reported user has been banned!"}),{status:200}
            );
        }
        if(action === "delete"){
            await User.findByIdAndDelete(userId);
            return new NextResponse(
                JSON.stringify({message:"Reported User has been Deleted Successfully!"}),{status:200}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Invalid Action!"}),{status:400}
        );

    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error when updating Reported user!"}),{status:500}
        );
    }
}