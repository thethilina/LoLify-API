import connect from "@/lib/db";
import BattleRequest from "@/lib/models/battleRequest";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server"



export const DELETE = async (request:Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const battleRequestId =  searchParams.get("battleRequestId");
        const loggeduserid = request.headers.get("loggeduserid");

        await connect();

        if(!battleRequestId){
            return new NextResponse(
                JSON.stringify({message:"Battle Request Id required"}),{status:400}
            );
        }
        if(!mongoose.Types.ObjectId.isValid(battleRequestId)){
            return new NextResponse(
                JSON.stringify({message:"Battle Request not found!"}),{status:404}
            );
        }

        if(!loggeduserid || loggeduserid === ""){
            return new NextResponse(
                JSON.stringify({message:"Unautherized user"}),{status:400}
            );
        }

        const battleRequest = await BattleRequest.findByIdAndDelete(battleRequestId);

        if(!battleRequest){
            return new NextResponse(
                JSON.stringify({message:"Invalid Battle Request!"}),{status:400}
            );
        }

        return new NextResponse(
            JSON.stringify({message:"Battle Request Deleted Successfully! "}),{status:200}
        );
        
        
    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error when delete battle request!",error:e.message}),{status:500}
        );
    }
}