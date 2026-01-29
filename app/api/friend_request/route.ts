import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import User from "@/lib/models/users";
import Frequest from "@/lib/models/FriendRequest";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import Notification from "@/lib/models/notifications";
import { setnotifi } from "@/lib/models/notifications";


export const GET = async (request : Request) => {


try{


const {searchParams} = new URL(request.url);
const userId = searchParams.get("userId");
const loggeduserid = request.headers.get("loggeduserid")



if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "missing userId " }),
        { status: 400 }
      );
    }


if(!Types.ObjectId.isValid(userId)){

    return new NextResponse(JSON.stringify({message : 'Invalide user id' } ) ,{status : 400})
}


if(userId !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


await connect();

const friendrequests = await Frequest.find(
    {touserid : userId}
).populate("byuserid", "username email avatar");

if(!friendrequests || friendrequests.length === 0) {
    return new NextResponse(JSON.stringify({message:"No requests to show"}) ,{status:202})
}

return new NextResponse(JSON.stringify({friendrequests : friendrequests}) ,{status:202})

}catch(e:any){

return new NextResponse(JSON.stringify({mesage:"Error fetching requests" + e.message} ) ,{status:500})

}


}

export const POST = async (request : Request) =>{


try{


const {searchParams} = new URL(request.url);
const byuserId = searchParams.get("byuserid");
const touserId = searchParams.get("touserid");

const loggeduserid = request.headers.get("loggeduserid")

if (!byuserId) {
      return new NextResponse(
        JSON.stringify({ message: "missing byuserId " }),
        { status: 400 }
      );
    }


if(!Types.ObjectId.isValid(byuserId)){

    return new NextResponse(JSON.stringify({message : 'Invalide byuser id' } ) ,{status : 400})
}

if(byuserId !== loggeduserid){
return new NextResponse(
  JSON.stringify({ message: "Unauthorized access" }),
  { status: 404 }
)

}



if (!touserId) {
      return new NextResponse(
        JSON.stringify({ message: "missing touserId " }),
        { status: 400 }
      );
    }


if(!Types.ObjectId.isValid(touserId)){

    return new NextResponse(JSON.stringify({message : 'Invalide touser id' } ) ,{status : 400})
}

if(byuserId === touserId){
 return new NextResponse(JSON.stringify({message : 'Thats Really stupid lol' } ) ,{status : 400})
}

await connect();

const byuser = await User.findById(byuserId);

if(!byuser){
    return new NextResponse(JSON.stringify({message:"byuser not found"}) , {status:404})
}

const touser = await User.findById(touserId);

if(!touser){
    return new NextResponse(JSON.stringify({message:"touser not found"}) , {status:404})
}

const byuserfrnds = byuser.friends

if(byuserfrnds.includes(touserId)){
 return new NextResponse(JSON.stringify({message:"Already Friends"}) , {status:400})
}




const friendreq = await Frequest.findOne(
     {
    byuserid : byuserId,
    touserid : touserId
    }
)

if(friendreq){
    return new NextResponse(JSON.stringify({message:"A friend request to this user has already sent !"}) , {status:400})
}

const newreq = new Frequest(
    {
    byuserid : byuserId,
    touserid : touserId
    }
)

await newreq.save();

const newnotifi = setnotifi( touserId, byuserId , "friendReq" ,  newreq._id )


if(!newreq){
    return new NextResponse(JSON.stringify({message:"Error sending request"}) , {status:400});

}



return new NextResponse(JSON.stringify({Friend_request:newreq}) , {status:200})

}catch(e:any){

return new NextResponse(JSON.stringify({mesage:"Error sending request" + e.message} ) ,{status:500})

}





}



export const PATCH = async (request : Request) =>{

try{

const {searchParams} = new URL(request.url);
const requestId = searchParams.get("requestId");
const loggeduserid = request.headers.get("loggeduserid")


if (!requestId) {
      return new NextResponse(
        JSON.stringify({ message: "missing requestId " }),
        { status: 404 }
      );
    }


if(!Types.ObjectId.isValid(requestId)){

    return new NextResponse(JSON.stringify({message : 'Invalide touser id' } ) ,{status : 400})
}


await connect();

const frequest = await Frequest.findById(requestId);

if(!frequest){
    return new NextResponse(JSON.stringify({message:"frequest not found"}) , {status:404})
}


if(frequest.touserid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


const updatedtouser = await User.findByIdAndUpdate(
frequest.touserid,
{$addToSet: {friends : frequest.byuserid}},
{new:true}

)

const updatedbyuser = await User.findByIdAndUpdate(
frequest.byuserid,
{$addToSet: {friends : frequest.touserid}},
{new:true}

)



if(!updatedtouser || !updatedbyuser){
    return new NextResponse(JSON.stringify({message:"Error adding friend" } ) ,{status:400})
}


const deletedreqest = await Frequest.findByIdAndDelete(requestId);

    
await setnotifi(frequest.byuserid.toString() ,frequest.touserid.toString() , "friendReqAcc", requestId)




if(!deletedreqest){

     return new NextResponse(JSON.stringify({message:"Error deleting request" } ) ,{status:400})
}



return new NextResponse(JSON.stringify({user:updatedtouser}) , {status:200})





}catch(e:any){
  return new NextResponse(
      JSON.stringify({ message: "error accepting request " + e.message }),
      { status: 500 }
    );
}



}



export const DELETE = async (request : Request) => {

try{


const {searchParams} = new URL(request.url);
const requestId = searchParams.get('requestId');
const loggeduserid = request.headers.get("loggeduserid")

if(!requestId || requestId === ""){

    return new NextResponse(JSON.stringify({message:"RequestId not found"}) , {status:404})
}

if(!mongoose.Types.ObjectId.isValid(requestId)){

    return new NextResponse(JSON.stringify({message:"RequestId isnt valid"}) , {status:400})
}

const frequest = await Frequest.findById(requestId);

if(!frequest){
    return new NextResponse(JSON.stringify({message:"Request not found"}) , {status:404})
}

if(frequest.byuserid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


const deletedreq = await Frequest.findByIdAndDelete(requestId);

if(!deletedreq){
     return new NextResponse(JSON.stringify({message:"Error deleting request"}) , {status:404})
}

return new NextResponse(JSON.stringify({message:"Request deleted successfully!"}) , {status:200})


}catch(e:any){
  return new NextResponse(JSON.stringify({message:"Error deleting request"}) , {status:500})
}

    
}