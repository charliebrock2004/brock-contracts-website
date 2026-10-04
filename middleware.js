import { next } from "@vercel/functions";

const BODY = "google-site-verification: google1ed7f8c191818e3d.html";

export default function middleware(request) {
  const path = new URL(request.url).pathname;
  if (path === "/google1ed7f8c191818e3d.html") {
    return new Response(BODY, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  }
  return next();
}

export const config = {
  matcher: "/google1ed7f8c191818e3d.html",
};
