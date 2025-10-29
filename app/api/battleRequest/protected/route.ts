import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import User from "@/lib/models/users";
import BattleRequest from "@/lib/models/battleRequest";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import { request } from "http";


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

        await newbattlerequest.save();

        return new NextResponse(JSON.stringify({message:"New Battle Request sent Successfully!",
            battleRequest : newbattlerequest}),
            {status:200})

    
} catch (e:any) {
    return new NextResponse(
        JSON.stringify({message:"Error in creating battle request!"}),{status:500}
        );
    }
}