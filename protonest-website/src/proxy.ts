import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const tab = request.nextUrl.searchParams.get("tab");

  if (tab !== "projects" && tab !== "research") {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.searchParams.delete("tab");

  if (destination.pathname === "/portfolio") {
    destination.hash = tab;
  }

  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/portfolio", "/portfolio/:path*"],
};
