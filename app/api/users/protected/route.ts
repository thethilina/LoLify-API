import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";


export const PATCH = async( request : Request)=>{


try{

const {searchParams} = new URL(request.url);
const userId = searchParams.get('userId');
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
 return new NextResponse('why the fuck u are trying to access another users ' , {status:403})
}

const body = await request.json();
const {fieldToEdit , newValue} = body;

if (!newValue) {
      return new NextResponse(
        JSON.stringify({ message: "Missing Values" }),
        { status: 400 }
      );
    }

if (!fieldToEdit) {
      return new NextResponse(
        JSON.stringify({ message: "Missing field to edit" }),
        { status: 400 }
      );
    }


await connect();

const updatedUser = await User.findByIdAndUpdate(

userId,
{[fieldToEdit] : newValue},    
{new:true}, 


)

if (!updatedUser) {
  return NextResponse.json(
    { message: "User not found" },
    { status: 404 }
  );
}

return NextResponse.json(updatedUser, { status: 200 });



}catch(e:any){

return new NextResponse("error updating user" + e.message , {status : 500});



}


}

export const DELETE = async (request : Request)=>{

try {

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
 return new NextResponse('why the fuck u are trying to access another users ' , {status:403})
}


await connect();

const deletedUser = await User.findByIdAndDelete(userId);

if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }


return  new NextResponse(`User updated succesfully` , {status : 200});

} catch(e : any){

 return new NextResponse("error deleting user" + e.message , {status : 500});   

}

}

