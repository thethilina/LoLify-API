import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import User from "@/lib/models/users";
import BattleRequest from "@/lib/models/battleRequest";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import { request } from "http";
import { setnotifi } from "@/lib/models/notifications";


//creating battle request api
export const POST = async (request:Request) => {
try {

    const loggeduserid = request.headers.get("loggeduserid");

    if(!loggeduserid || loggeduserid === ""){
        return new NextResponse(
            JSON.stringify({message:"Unautharized user!"}),{status:401}
        )
}
    const body = await request.json();
    

    const {user_id_by , user_id_to} = body;
    console.log(body)

        if(!user_id_by || !user_id_to){
            return new NextResponse(
                JSON.stringify({message:"Missing userIdBy or userIdTo!"}),{status:404}
            );
        }

        if(user_id_by === user_id_to){
            return new NextResponse(JSON.stringify({message:"Invalid Request"}),{status:400}
            );
        }


        if(!mongoose.Types.ObjectId.isValid(user_id_by) || !mongoose.Types.ObjectId.isValid(user_id_to)){
            return new NextResponse(
                JSON.stringify({message:"UserIdTo or UserIdBy isn't valid"}),{status:400}
            );
        }

        if(user_id_by !== loggeduserid){
            return new NextResponse(JSON.stringify({message:"access denied!"}),{status:400}
            );
        }

        
        await connect();

        const newbattlerequest = new BattleRequest(body);

        console.log(newbattlerequest)
        await newbattlerequest.save();


        await setnotifi(user_id_to, user_id_by, "challengeReq" , newbattlerequest._id.toString())


        return new NextResponse(JSON.stringify({message:"New Battle Request sent Successfully!",
            battleRequest : newbattlerequest}),
            {status:200})

    
} catch (e:any) {
    return new NextResponse(
        JSON.stringify({message:"Error in creating battle request!"}),{status:500}
        );
    }
}
//fetch all battle requests

export const GET = async (request:Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        const loggeduserid = request.headers.get("loggeduserid");
        if(!userId){
            return new NextResponse(
                JSON.stringify({message:"Invalid userId"}),{status:400}
            );
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:"User Not Found!"}),{status:404}
            );
        }
           if(userId !== loggeduserid){
            return new NextResponse(JSON.stringify({message:"access denied!"}),{status:400}
            );
        }

        await connect();

        const userObjetcId = new mongoose.Types.ObjectId(userId);

        const requests = await BattleRequest.find({
            $or : [{user_id_by: userObjetcId},{user_id_to: userObjetcId}],
        })

        return new NextResponse(
            JSON.stringify({requests}),{status:200}
        )

    } catch (e:any) {
        console.error("Error fetching battle requests:", e);
        return new NextResponse(
                JSON.stringify({message:"Error Fetching Battle Requests!",error:e.message}),{status:500}
            );
        
    }
}