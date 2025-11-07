import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import Meme from "@/lib/models/meme";
import User from "@/lib/models/users";
import Comment from "@/lib/models/comment";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import { setnotifi } from "@/lib/models/notifications";


export const POST = async (request : Request) => {

try{
const body = await request.json();
const {userid ,memeid} = body;

const loggeduserid = request.headers.get("loggeduserid")


if(!loggeduserid){

   return new NextResponse('missing id from cookies' , {status:404})

}



if(!memeid ){

  return new NextResponse('Meme id not found' , {status:400})

}

if(!mongoose.Types.ObjectId.isValid(memeid) ){

   return new NextResponse('Meme id  is not valid' , {status:400})
}


await connect();

const meme = await Meme.findById(memeid);


if(!meme ){

 return new NextResponse('Meme  not found' , {status:400})
}






if(!body ){

 return new NextResponse('Body  not found' , {status:404})
}



if(!userid || userid === ""){
return new NextResponse('user id not found' , {status:404})

}


if(!mongoose.Types.ObjectId.isValid(userid) ){

   return new NextResponse('userid  is not valid' , {status:400})
}

if(userid !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


const newcomment = new Comment(body);

await newcomment.save();

if(!newcomment){
    return new NextResponse("Error posting comment" , {status:400})
}

await setnotifi(meme.userid.toString(), loggeduserid , "comment" , memeid )

return new NextResponse(JSON.stringify({newcomment}) , {status:200})

}catch(e:any){

 return new NextResponse('Error posting comment'+ e.message , {status:500})

}

}



export const PATCH = async (request : Request) => {

try{

const {searchParams} = new URL(request.url);
const commentId = searchParams.get("commentId");
const loggeduserid = request.headers.get("loggeduserid")


if(!loggeduserid){

   return new NextResponse('missing id from cookies' , {status:404})

}




if(!commentId ){

  return new NextResponse('comment id  not found' , {status:404})

}

if(!mongoose.Types.ObjectId.isValid(commentId) ){

   return new NextResponse('comment id is not valid' , {status:404})
}


await connect();

const comment = await Comment.findById(commentId);

if(comment.userid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}



if(!comment){

 return new NextResponse('Meme  not found' , {status:400})
}



const body = await request.json();

if(!body){

    return new NextResponse(JSON.stringify({message:"body not found"}) , {status:404})
}

const updatedcomment = await Comment.findByIdAndUpdate(
    commentId,
    {...body},
    {new:true}
)

if(!updatedcomment){
    return new NextResponse(JSON.stringify({message:"Error udating comment"}) , {status:400})
}

return new NextResponse( JSON.stringify({comment:updatedcomment}) , {status:200})

}catch(e:any){

 return new NextResponse('Error updating comment' + e.message, {status:500})


}

}

export const DELETE = async (request :  Request) =>{

try{

 
const {searchParams} = new URL(request.url);
const commentId = searchParams.get("commentId");

const loggeduserid = request.headers.get("loggeduserid")


if(!loggeduserid){

   return new NextResponse('missing id from cookies' , {status:404})

}




if(!commentId ){

  return new NextResponse('comment id or user id not found' , {status:404})

}

if(!mongoose.Types.ObjectId.isValid(commentId) ){

   return new NextResponse('comment id or User id is not valid' , {status:404})
}


await connect();

const comment = await Comment.findById(commentId);

if(comment.userid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


if(!comment){

 return new NextResponse('Comment  not found' , {status:400})
}
   

const deletedcomment = await Comment.findByIdAndDelete(commentId);

if(!deletedcomment){
    return new NextResponse(JSON.stringify({message:"Error deleting comment"}) , {status:400})
}

return new NextResponse(JSON.stringify({message:"Comment deleted successfully!"}) , {status:200})

}catch(e:any){

  return new NextResponse('Error deleting comment' + e.message, {status:500})   
}

}