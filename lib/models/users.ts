import mongoose, {Schema , model , models} from "mongoose";

const userSchema = new Schema (
{

    username : {type:String  , required : true , unique : true},
    email : {type: String , required : true , unique : true},
    birthdate : {type :String , required : true},
    password : {type:String , required : true },
    avatar : {type:String  , required : true },
    coverphoto : {type: String , required : true },
    orbs : {type: Number , required: true},
    friends :[{type: mongoose.Schema.Types.ObjectId , ref: "User" } ],
//uttoo ! i add the status here for make change for reported user
    status : {type:String , enum:["active","banned"],default:"active"}



},{

    timestamps:true

}

)

const User = models.User || model('User' , userSchema);

export default User;