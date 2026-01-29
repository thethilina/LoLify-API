import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request : Request)=> {


try{


const {searchParams} = new URL(request.url);
const  userid = searchParams.get('userid')




await connect();


const user = await User.findById(userid).select("-password -email  -createdAt -updatedAt -__v");
return new NextResponse(JSON.stringify(user) , {status:200})


}catch(e:any){

    return new NextResponse("Error in fetching users" +e.message , {status:500});

}



}



