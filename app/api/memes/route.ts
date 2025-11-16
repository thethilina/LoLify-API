import { NextResponse } from "next/server";   
import mongoose from "mongoose";
import Meme from "@/lib/models/meme";
import User from "@/lib/models/users";
import connect from "@/lib/db";  
import { Types } from "mongoose";



export const GET = async (request : Request) =>{


try{

const {searchParams} = new URL(request.url);
const  page : any = parseInt(searchParams.get('page') || "1");
const  limit : any = parseInt(searchParams.get('limit') || "10");    



await connect();

const  skip = (page - 1) * limit;


const memes = await Meme.find()
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
  
return new NextResponse(JSON.stringify(memes) , {status:200})


}catch(e:any){

    return new NextResponse("Error in fetching memes" +e.message , {status:500});

}

}





