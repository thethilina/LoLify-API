import mongoose, {Schema , model , models} from "mongoose";

const notifiSchema = new Schema(

{
    touser:{type: mongoose.Schema.Types.ObjectId , ref: "User" },
    auser:{type: mongoose.Schema.Types.ObjectId , ref: "User" },
    stauts:{type:String ,  enum:['toShow' , 'viewed'] , default:'toShow' , required:true},
    body:{type:String , required:true}
},{

    timestamps:true

}

)

const Notification = models.Notification || model('Notification' , notifiSchema)

export  default Notification