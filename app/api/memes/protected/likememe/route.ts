import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import Meme from "@/lib/models/meme";
import User from "@/lib/models/users";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import { setnotifi } from "@/lib/models/notifications";

export const POST = async(request : Request) => {

try{

const {searchParams} = new URL(request.url);
const memeId = searchParams.get("memeId");
const userId = searchParams.get("userId")
const loggeduserid = request.headers.get("loggeduserid");




if(!userId|| userId  === ""){

    return new NextResponse(JSON.stringify({message:"userId not found"}) , {status:404})
}

if(!mongoose.Types.ObjectId.isValid(userId )){

    return new NextResponse(JSON.stringify({message:"userId  isnt valid"}) , {status:400})
}

if(!memeId || memeId === ""){

    return new NextResponse(JSON.stringify({message:"memeId not found"}) , {status:404})
}

if(!mongoose.Types.ObjectId.isValid(memeId)){

    return new NextResponse(JSON.stringify({message:"memeId isnt valid"}) , {status:400})
}

 if(loggeduserid !== userId){
        return new NextResponse(
            JSON.stringify({message:"Invalid user"}),{status:400}
        );
    }



await connect();

const meme = await Meme.findById(memeId);

if(!meme){
    return new NextResponse(JSON.stringify({message:"meme not found"}) , {status:404})
}

const user = await User.findById(userId);

if(!user){
    return new NextResponse(JSON.stringify({message:"user not found"}) , {status:404})
}

const alreadyLiked = meme.likecount.includes(userId);
const alreadyDisLiked = meme.dislikecount.includes(userId);

if (alreadyLiked || alreadyDisLiked) {
    return new NextResponse(JSON.stringify({message:"Already Reacted"}) , {status:400})
}


const updatedmeme = await Meme.findByIdAndUpdate(
    memeId,
    {$addToSet :{likecount:userId}},
    {new:true}
)

if(!updatedmeme){

    
return new NextResponse(JSON.stringify({message:"Error Liking meme: "  }) , {status:400})
}


await setnotifi(meme.userid.toString(), userId, 'like', memeId)



return new NextResponse(JSON.stringify({meme:updatedmeme}) , {status:200})


}catch(e:any){

return new NextResponse(JSON.stringify({message:"Error Liking meme: " + e.message }) , {status:500})

}





}