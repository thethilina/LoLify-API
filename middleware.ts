import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {

  const resHeaders = new Headers();
  resHeaders.set("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN!); 
  resHeaders.set("Access-Control-Allow-Credentials", "true");
  resHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  resHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-CSRF-Token"
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: resHeaders,
    });
  }

  const token = req.cookies.get("token")?.value;

  if (!token) 
    return NextResponse.json(
      { message: "unauthorized" },
      { status: 401, headers: resHeaders }
    );

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded: any = jwt.verify(token, secret);

    const res = NextResponse.next();
    res.headers.set("loggeduserid", decoded.id);
    
    res.headers.set("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN!);
    res.headers.set("Access-Control-Allow-Credentials", "true");

    return res;
  } catch {
    return NextResponse.json(
      { message: "invalid or expired token" },
      { status: 401, headers: resHeaders }
    );
  }
}

export const config = {
  matcher: [
    "/api/comments/protected/:path*",
    "/api/users/protected/:path*",
    "/api/memes/protected/:path*",
    "/api/friend_request/:path*",
    "/api/battleRequest/:path*",
    "/api/battle/:path*",
    "/api/reportUser/:path*",
    "/api/reportMeme/:path*",
  ],
  runtime: "nodejs",
};
