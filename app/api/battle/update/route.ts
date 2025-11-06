import connect from "@/lib/db"
import Battle from "@/lib/models/battle";
import { NextResponse } from "next/server"
import { setnotifi } from "@/lib/models/notifications";

export const PATCH = async (request:Request) => {
    try {
        await connect();

        //parse the body
        const {battleId,status} =  await request.json();
        
        if(!battleId){
            return new NextResponse(
                JSON.stringify({message:"Battle id is required!"}),{status:400}
            );
        }
        //fetch battle

        const battle = await Battle.findById(battleId);

        if(!battle){
            return new NextResponse(
                JSON.stringify({message:"Battle Not Found!"}),{status:404}
            );
        }

        //update the status
        if(status){
            battle.status = status;
        }


        //battle ending: calculate the winner
        if(status === "completed"){
            const voteUser1 = battle.vote_user_1.length;
            const voteUser2 = battle.vote_for_user_2.length;

            if(voteUser1 > voteUser2){
                battle.winner = battle.user_id_by.toString();
            }
            else if(voteUser1 < voteUser2){
                battle.winner = battle.user_id_to.toString();
            }
            else{
                battle.winner = "Draw";
            }
        }

        //save the changes
        const updatedBattle = await battle.save();


        //respond
        return new NextResponse(
            JSON.stringify({message:"Battle Successfully updated!",battle:updatedBattle}),{status:200}
        )


    } catch (e:any) {
        return new NextResponse(
            JSON.stringify({message:"Error in Updating Battle",error:e.message}),{status:500}
        )
    }
}