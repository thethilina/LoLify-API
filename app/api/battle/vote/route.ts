import { request } from "http";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Battle from "@/lib/models/battle";




export const POST = async (request:Request) => {
    try {
        await connect();
        
        const {battleId , voterId , voteFor} = await request.json();



        if(!battleId || !voterId || !voteFor){
            return new NextResponse(
                JSON.stringify({message:"Invalid action!"}),{status:400}
            );
        }

        const battle = await Battle.findById(battleId);

        if(!battle){
            return new NextResponse(
                JSON.stringify({message:"battle Not Found"}),{status:404}
            );
        }

        //fixing the duplication of voting

        if(battle.vote_user_1.includes(voterId) || battle.vote_for_user_2.includes(voterId)){
            return new NextResponse(
                JSON.stringify({message:"User already voted!"}),{status:400}
            );
        }

        //save the vote
        if(voteFor === "user_id_by"){
            battle.vote_user_1.push(voterId)
        }else if(voteFor === "user_id_to"){
            battle.vote_for_user_2.push(voterId)
        }else{
            return new NextResponse(
                JSON.stringify({message:"Vote target Invalid"}),{status:400}
            );
        }

        await battle.save();



        return new NextResponse(
            JSON.stringify({message:"Vote saved successfully!",
                votes: {
                    user_id_by : battle.vote_user_1.length,
                    user_id_to : battle.vote_for_user_2.length
                },
            }),{status:200}
        )



    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error in voting",error:e.message}),{status:500}
        );
    }
}