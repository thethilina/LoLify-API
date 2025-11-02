import connect from "@/lib/db";
import Battle from "@/lib/models/battle";
import { url } from "inspector";
import mongoose from "mongoose";
import { NextResponse } from "next/server"


export const DELETE = async (request:Request) => {
    try {
        await connect();

        const {searchParams} = new URL(request.url);
        const battleId = searchParams.get("battleId");
        const loggeduserid = request.headers.get("loggeduserid")

        if(!battleId){
            return new NextResponse(
                JSON.stringify({message:"Battle Id required!"}),{status:400}
            );
        }

        if(!mongoose.Types.ObjectId.isValid(battleId)){
            return new NextResponse(
                JSON.stringify({message:"Battle Id Not found!"}),{status:404}
            );
        }

        if(!loggeduserid || loggeduserid === ""){
            return new NextResponse(
                JSON.stringify({message:"Unautharize user"}),{status:401}
            );
        }

        const battle = await Battle.findByIdAndDelete(battleId);

        if(!battle){
            return new NextResponse(
                JSON.stringify({message:"Invalid Battle Id!"}),{status:400}
            );
        }

        

        
        return new NextResponse(
            JSON.stringify({message:"Battle successfully Deleted!"}),{status:200}
        );




    } catch (e:any) {
        console.error("Delete Battle error: " , e);
        return new NextResponse(
            JSON.stringify({message:"Error when Delete battle",error:e.message}),{status:500}
        );
    }
}