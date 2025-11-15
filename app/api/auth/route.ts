import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/models/users";
import { request } from "http";
import mongoose from "mongoose";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";


export const POST = async (request : Request) =>{


try{

const body =  await request.json();
const {username , password} = body;

if(!username || !password || username === "" || password === ""){

    return new NextResponse(JSON.stringify({message:"miing values"}) , {status:404})
}

await connect();

const user = await User.findOne({username});

if(!user){

    return new NextResponse(JSON.stringify({message:"User not found !"}) , {status:404})
}

if(password !== user.password) {

return new NextResponse(JSON.stringify({message:"Invalid password!"}) , {status:400})
}

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
}


const payload = {id: user._id.toString() , email : user.email}
const token = jwt.sign(payload , secret , {expiresIn : "7d"});

const res = NextResponse.json({user:user});



res.cookies.set({
  name: "token",
  value: token,
  httpOnly: true,  // you can keep this for security
  path: "/",
  secure: false,   // must be false on localhost
  sameSite: "lax", // works on localhost
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});




return res;



}catch(e:any){

return new NextResponse(JSON.stringify({message:"Error loggin: " + e.message}) , {status:500}  )


}



}