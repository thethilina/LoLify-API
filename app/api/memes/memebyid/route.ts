import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";
import Meme from "@/lib/models/meme";



const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async (request : Request)=> {


try{


const {searchParams} = new URL(request.url);
const  memeid = searchParams.get('memeid')




await connect();


const meme = await Meme.findById(memeid)
return new NextResponse(JSON.stringify(meme) , {status:200})


}catch(e:any){

    return new NextResponse("Error in fetching meme" +e.message , {status:500});

}



}



