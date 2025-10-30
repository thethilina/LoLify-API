import Battle from "@/lib/models/battle";
import BattleRequest from "@/lib/models/battleRequest";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Savate } from "next/font/google";


//battle create
export const POST = async (request:Request) => {
try {
    const {searchParams} = new URL(request.url);
    const battlerequestid = searchParams.get("battlerequestid");
    const loggeduserid = request.headers.get("loggeduserid");

    if(!battlerequestid || battlerequestid === ""){
        return new NextResponse(
            JSON.stringify({message:"Not a valid battle request! "}),{status:400}
        );
    }
        

        if(!mongoose.Types.ObjectId.isValid(battlerequestid)){
            return new NextResponse(
                JSON.stringify({message:" Battle Request not found !"}),{status:404}
            );
        }

        if(!loggeduserid || loggeduserid === ""){
            return new NextResponse(
                JSON.stringify({message:"Unautharized User!"}),{status:401}
            );
        }


            const battlereq = await BattleRequest.findById(battlerequestid);

            if(!battlereq){
                return new NextResponse(
                    JSON.stringify({message:"Battle Request not found!"}),{status:404}
                );
            }

            const battledata = {
                "user_id_by" : battlereq.user_id_by.toString(),
                "user_id_to" : battlereq.user_id_to.toString(),
                "startedTime" : new Date(),
                "status" : "ongoing"
            }

            await connect();

            const newBattle = new Battle(battledata);

            await newBattle.save();

            if(!newBattle){
                return new NextResponse(
                    JSON.stringify({message:"Error Posting in battle!"}),{status:400}
                );
            }

            const deletedRequest = await BattleRequest.findByIdAndDelete(battlerequestid);

            if(!deletedRequest){
                return new NextResponse(
                    JSON.stringify({message:"Error inn deleting battle request!"}),{status:400}
                );
            }

            //Battle starting successfully
            return new NextResponse(
                JSON.stringify({message:"Battle Started!",battle:newBattle}),{status:200}
            );


    } catch (e:any) {
    return new NextResponse(JSON.stringify({
        message:"Error when Creating a Battle!" + e.message}),{status:500}
        );
    }   
}