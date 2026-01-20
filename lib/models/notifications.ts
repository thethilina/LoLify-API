import mongoose, {Schema , model , models} from "mongoose";
import connect from "../db";
import { NextResponse } from "next/server";
import User from "./users";
import Meme from "./meme";
import Frequest from "./FriendRequest";


const notifiSchema = new Schema(
{
    touser:{type: mongoose.Schema.Types.ObjectId , ref: "User" },
    auser:{type: mongoose.Schema.Types.ObjectId , ref: "User" },
    type:{type:String ,  enum:['like' , 'comment' , 'challengeReq'  ,'challengeAcc', 'battleend' , 'friendReq' , 'friendReqAcc' ,'vote' ,'dislike'  ] , required:true},
    status:{type:String ,  enum:['toShow' , 'viewed'] , default:'toShow' },
    memeid:{type: mongoose.Schema.Types.ObjectId , ref: "Meme" },
    battleid:{type: mongoose.Schema.Types.ObjectId , ref: "Battle" },
    challengeReqid:{type: mongoose.Schema.Types.ObjectId , ref: "ChallengeRequest" },
    friendReqid: { type: mongoose.Schema.Types.ObjectId, ref: "Frequest" },
    body:{type:String , required:true}
},
{
    timestamps:true
}
)



const Notification = models.Notification || model('Notification' , notifiSchema)

export const setnotifi = async (
    touser: String,
    auser: String,
    type: 'like' | 'comment' | 'challengeReq' | 'challengeAcc' | 'battleend' | 'friendReq' | 'friendReqAcc' |'vote' | 'dislike' ,
    id?: String
) => {
    try {
        await connect()
        const aboutuser = await User.findById(auser)
        if (!aboutuser) return new NextResponse("user not found", {status:404})
        const username = aboutuser.username
        let body = ""
        const notification: any = { touser, auser, type, body }

        if (type === "like") {
            if (!id) return new NextResponse("memeid required for like", {status:400})
            body = `${username} liked your meme`
            notification.memeid = id
        }
        else if (type === "comment") {
            if (!id) return new NextResponse("memeid required for comment", {status:400})
            body = `${username} commented on your meme`
            notification.memeid = id
        }
        else if (type === "challengeReq") {
            if (!id) return new NextResponse("challengeReqid required", {status:400})
            body = `${username} sent you a challenge request`
            notification.challengeReqid = id
        }
        else if (type === "challengeAcc") {
            if (!id) return new NextResponse("battleid required for challengeAcc", {status:400})
            body = `${username} accepted your challenge`
            notification.battleid = id
        }
        else if (type === "battleend") {
            if (!id) return new NextResponse("battleid required for battleend", {status:400})
            body = `Battle with ${username} has ended. Check results `
            notification.battleid = id
        }
        else if (type === "friendReq") {
            if (!id) return new NextResponse("friendReqid required", {status:400})
            body = `${username} sent you a friend request`
            notification.friendReqid = id
        }
        else if (type === "friendReqAcc") {
            if (!id) return new NextResponse("friendReqid required", {status:400})
            body = `${username} accepted your friend request`
            notification.friendReqid = id

        }else if (type ==="vote") {
            if (!id) return new NextResponse("friendReqid required", {status:400})
            body = `${username} voted for you.`
            notification.battleid = id
        }else if (type ==="dislike") {
            if (!id) return new NextResponse("friendReqid required", {status:400})
            body = `${username} disliked your meme.`
            notification.memeid= id
           
        }

        notification.body = body
        const newnotifi = new Notification(notification)
        await newnotifi.save()

        return NextResponse.json({success:true, data:newnotifi}, {status:201})

    } catch(e:any) {
        return new NextResponse("Error sending notification" + e.message, {status:500})
        
    }
}

export default Notification