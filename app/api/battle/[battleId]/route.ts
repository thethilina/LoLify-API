import { NextResponse } from "next/server"
import connect from "@/lib/db";
import mongoose from "mongoose";
import Battle from "@/lib/models/battle";


//fetch a single battle
export const GET = async (request:Request,context:any) => {
    try {
        await connect();

       const params = await context.params;
       const {battleId} =params;

       if(!mongoose.Types.ObjectId.isValid(battleId)){
            return new NextResponse(
                JSON.stringify({message:"Battle Id Not found"}),{status:404}
            );

       }

       const battle = await Battle.findById(battleId);

       if(!battle){
        return new NextResponse(
            JSON.stringify({message:"Invalid Battle Id"}),{status:400}
        );
       }

       

       return new NextResponse(
        JSON.stringify({message:"Battle fetched successfully!",fetchedBattle:battle}),{status:200}
       );
        
    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error in fetching user by id ",error:e.message}),{status:500}
        )
    }
}


