
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {


  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.json({ message: "unauthorized" }, { status: 401 });

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, secret);

    const res = NextResponse.next();
    res.headers.set("loggeduserid", decoded.id); 
    return res;
  } catch {
    return NextResponse.json({ message: "invalid or expired token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/comments/protected/:path*", "/api/users/protected/:path*" , "/api/memes/protected/:path*" , "/api/friend_request/:path*" ,  "/api/battleRequest/:path*"], 
   runtime: "nodejs",
};