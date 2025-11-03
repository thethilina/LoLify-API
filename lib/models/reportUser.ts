import {Schema,model,models} from "mongoose";

const reportUserSchema = new Schema (
    {
        user_id_to: {type:Schema.Types.ObjectId,ref:"User",required:true},
        user_id_by: {type:Schema.Types.ObjectId,ref:"User",required:true},
        status: {type:String,required:true},
        body: {type:String,required:true},

    },
    {
        timestamps:true,
    }
)
    const ReportUser = models.ReportUser || model("ReportUser",reportUserSchema);

    export default ReportUser;
