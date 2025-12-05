import Battle from "@/lib/models/battle";
import BattleRequest from "@/lib/models/battleRequest";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { Savate } from "next/font/google";
import { headers } from "next/headers";
import { setnotifi } from "@/lib/models/notifications";

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

        await connect();

            const battlereq = await BattleRequest.findById(battlerequestid);

            if(!battlereq){
                return new NextResponse(
                    JSON.stringify({message:"Battle Request not found!"}),{status:404}
                );
            }
            
            const now = new Date();

            
            const slString = now.toLocaleString("en-US", { timeZone: "Asia/Colombo" });

            
            const slDate = new Date(slString);
            
                        
            var enddate: Date = new Date(slDate)

                if (battlereq.timediruation  === "1d") {
                    enddate = new Date(enddate.getTime() + 1 * 24 * 60 * 60 * 1000);
                    console.log("dawasai")
                }

                if (battlereq.timediruation === "7d") {
                    enddate = new Date(enddate.getTime() + 7 * 24 * 60 * 60 * 1000);
                    console.log("dawas 7i")
                }

                if (battlereq.timediruation === "30d") {
                    enddate = new Date(enddate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    console.log("dawas 30")
                }


            const battledata = {
                "user_id_by" : battlereq.user_id_by.toString(),
                "user_id_to" : battlereq.user_id_to.toString(),
                "startedTime" : slDate,
                "timediruation" : battlereq.timediruation,
                "endTime": enddate
            }

            
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

            await   setnotifi(battlereq.user_id_by.toString(), battlereq.user_id_to.toString() , "challengeAcc", newBattle._id.toString() )

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

//Fetching all the battle form a user

export const GET = async (request:Request) => {
    try {
        await connect();

        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId){
            return new NextResponse(
                JSON.stringify({message:"User is required"}),{status:400}
            );
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message:"userId Not found!"}),{status:404}
            );
        } 

        
        //getting battles from related users
        const battle = await Battle.find({
            $or : [{user_id_by : userId} , {user_id_to : userId}],
        })

        if(!battle || battle.length === 0){
            return new NextResponse(
                JSON.stringify({message:"No Battle  found for this user!"}),{status:404}
            );
        }
        return new NextResponse(
            JSON.stringify({message:"Battles found!", data:battle}),{status:200}
        );

    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error in Fetching all the Battles!",error:e.message}),{status:500}
        );
    }
}

