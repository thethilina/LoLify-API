import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;


export const POST = async( request : Request)=>{


try{


const body = await request.json();
await connect();
const newuser = new User(body);
await newuser.save();
return new NextResponse(JSON.stringify({message:"User Created  succesfully !" , user : newuser}) , {status : 200})



}catch(e:any){

return new NextResponse(JSON.stringify("error creating user" + e.message) , {status : 500});



}


}