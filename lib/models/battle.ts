import {Schema,models,model, SchemaType} from "mongoose";
import User from "./users";



const battleSchema = new Schema(
    {
        user_id_by: {type:Schema.Types.ObjectId,ref:"User",required:true},
        user_id_to: {type:Schema.Types.ObjectId,ref:"User",required:true},
        vote_user_1: [{type:Schema.Types.ObjectId,ref:"User"}],
        vote_for_user_2: [{type:Schema.Types.ObjectId,ref:"User"}],
        startedTime: {type:Date,default: Date.now , required :true},
        endTime:{type:Date , required: true},
        timediruation: {type:String , required:true},
        status: {type:String , enum:["onGoing" , "isCompleted" , "Draw"], default : "onGoing" , required:true},
        winner: {type:Schema.Types.ObjectId,ref:"User"}
    },
    {
        timestamps:true
    }
);

const Battle = models.Battle || model("Battle", battleSchema);

export default Battle;
