import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/auth";
import { cookies } from "next/headers";
import { getSessionToken } from "@/lib/session";

export async function GET() {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const token = getSessionToken();

    if (token && token.length > 0) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/admin",
            },
        });
    }
    const url = google.createAuthorizationURL(state, codeVerifier, ["profile", "email"]);

    cookies().set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });
    cookies().set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    });

    const urlString = url.toString()

    console.log(urlString)

    return new Response(null, {
        status: 302,
        headers: {
            Location: urlString,
        },
    });
}