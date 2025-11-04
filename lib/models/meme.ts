import mongoose, {Schema , model , models} from "mongoose";

const memeSchema = new Schema (
{

    memetitle  : {type:String  , required : true },
    taglines : [{type: String }],
    likecount: [{type: mongoose.Schema.Types.ObjectId , ref: "User" } ],
    dislikecount: [{type: mongoose.Schema.Types.ObjectId , ref: "User" } ],
    memeimg :{type:String  , required : true },
    userid :{type: mongoose.Schema.Types.ObjectId , ref: "User" ,required : true  } ,

},{

    timestamps:true

}

)

const Meme = models.Meme || model('Meme' , memeSchema);

export default Meme;