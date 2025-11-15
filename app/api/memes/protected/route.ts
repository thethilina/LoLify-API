import { NextRequest, NextResponse } from "next/server";   
import mongoose from "mongoose";
import Meme from "@/lib/models/meme";
import User from "@/lib/models/users";
import connect from "@/lib/db";  
import { Types } from "mongoose";
import jwt from "jsonwebtoken";





export const GET = async (request : Request) =>{


try{

const {searchParams} = new URL(request.url);
const userId = searchParams.get("user")


if(!userId || userId === "") {
  return new NextResponse("userid missing" , {status:404});
}

if(!mongoose.Types.ObjectId.isValid(userId)){
  return new NextResponse("User Id isnt valid" , {status:404});
}

 const user = await User.findById(userId);

 if(!user){
   return new NextResponse("User not found" , {status:404});
 }



await connect();


const memes = await Meme.find();
return new NextResponse(JSON.stringify(memes) , {status:200})


}catch(e:any){

    return new NextResponse("Error in fetching memes" +e.message , {status:500});

}



}











const addCorsHeaders = (res: NextResponse) => {
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
};

// Handle OPTIONS preflight
export const OPTIONS = () => {
  const res = NextResponse.json({}, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
};

// Helper: get logged in user id from JWT cookie
const getLoggedUserId = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
};

// POST /api/memes/protected
export const POST = async (req: NextRequest) => {
  try {
    const loggedUserId = getLoggedUserId(req);
    if (!loggedUserId) {
      const res = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      return addCorsHeaders(res);
    }

    const body = await req.json();
    const { userid } = body;

    if (!body) {
      const res = NextResponse.json({ message: "Body not found" }, { status: 400 });
      return addCorsHeaders(res);
    }

    if (userid !== loggedUserId) {
      const res = NextResponse.json(
        { message: "Cannot post meme for another user" },
        { status: 403 }
      );
      return addCorsHeaders(res);
    }

    await connect();
    const newMeme = new Meme(body);
    await newMeme.save();

    const res = NextResponse.json(
      { message: "Meme posted successfully!", meme: newMeme },
      { status: 200 }
    );
    return addCorsHeaders(res);
  } catch (e: any) {
    const res = NextResponse.json({ message: "Error posting meme", error: e.message }, { status: 500 });
    return addCorsHeaders(res);
  }
};





export const PATCH = async (request : Request ) =>{

try{

const {searchParams} = new URL(request.url);
const memeId = searchParams.get('memeId');
const loggeduserid = request.headers.get("loggeduserid")

if ( !memeId) {
      return new NextResponse(
        JSON.stringify({ message: "missing memeId " }),
        { status: 400 }
      );
    }


if( !Types.ObjectId.isValid(memeId)){

    return new NextResponse(JSON.stringify({message : 'Invalide  memeid' } ) ,{status : 400})
}


await connect();



const meme = await Meme.findById(memeId);

if(!meme){

 return new NextResponse('Meme  not found' , {status:400})
}


if(meme.userid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}


const body = await request.json();

if (!body) {
      return new NextResponse(
        JSON.stringify({ message: "Missing Values" }),
        { status: 400 }
      );
    }


const updatedmeme = await Meme.findByIdAndUpdate(
memeId,
{...body},
{new:true}

)


if (!updatedmeme) {
      return new NextResponse(JSON.stringify({ message: "Failed" }), {
        status: 404,
      });
    }


return  new NextResponse(JSON.stringify({message:"Meme updated" , meme : updatedmeme}) , {status : 200});

}catch(e:any){

}







}



export const DELETE = async (request : Request)=>{

try {

const {searchParams} = new URL(request.url);
const memeId = searchParams.get("memeId");
const loggeduserid = request.headers.get("loggeduserid")


if (!memeId) {
      return new NextResponse(
        JSON.stringify({ message: "missing memeId " }),
        { status: 400 }
      );
    }


if(!Types.ObjectId.isValid(memeId)){

    return new NextResponse(JSON.stringify({message : 'Invalide meme id' } ) ,{status : 400})
}

await connect();

const meme = await Meme.findById(memeId);

if(!meme){
  return new NextResponse(JSON.stringify({ message: "Meme not found" }), {
        status: 404,
      });
}

if(meme.userid.toString() !== loggeduserid){
 return new NextResponse('why the fuck u are trying to access another users ' , {status:404})
}

const deletedmeme = await Meme.findByIdAndDelete(memeId);

if (!deletedmeme) {
      return new NextResponse(JSON.stringify({ message: "Meme not found" }), {
        status: 404,
      });
    }


return  new NextResponse(`Meme Deleted successfully` , {status : 200});

} catch(e : any){

 return new NextResponse("error deleting meme" + e.message , {status : 500});   

}

}

