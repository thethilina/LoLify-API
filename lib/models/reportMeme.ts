
import {Schema,models,model} from "mongoose";

const reportMemeSchema = new Schema(
    {
        user_id_reporter:{type:Schema.Types.ObjectId,ref:"User",required:true},
        meme_id:{type:Schema.Types.ObjectId,ref:"Meme",required:true},
        body:{type:String,required:true},
       
    },{

    timestamps:true,

}
)

const ReportMeme = models.ReportMeme || model("ReportMeme", reportMemeSchema)

export default ReportMeme;