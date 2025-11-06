import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request : Request)=> {


try{

    const nowUTC = new Date();
const SL_Time = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));

console.log(SL_Time);

const {searchParams} = new URL(request.url);
const  page : any = parseInt(searchParams.get('page') || "1");
const  limit : any = parseInt(searchParams.get('limit') || "10");    



await connect();

const  skip = (page - 1) * limit;

const users = await User.find().skip(skip).limit(limit);
return new NextResponse(JSON.stringify(users) , {status:200})


}catch(e:any){

    return new NextResponse("Error in fetching users" +e.message , {status:500});

}



}



