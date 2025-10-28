import {Schema,models,model, SchemaType} from "mongoose";

const battleSchema = new Schema(
    {
        user_id_by: {type:Schema.Types.ObjectId,ref:"User",required:true},
        user_id_to: {type:Schema.Types.ObjectId,ref:"User",required:true},
        vote_user_1: [{type:Schema.Types.ObjectId,ref:"User"}],
        vote_for_user_2: [{type:Schema.Types.ObjectId,ref:"User"}],
        startedTime: {type:Date,default: Date.now , required :true},
        status: {type:String,required:true},
        winner: {type:String},
    },
    {
        timestamps:true
    }
);

const Battle = models.Battle || model("Battle", battleSchema);

export default Battle;
