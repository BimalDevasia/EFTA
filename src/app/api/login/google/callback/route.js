import {
    generateSessionToken,
    createSession,
    setSessionTokenCookie,
} from "@/lib/session";
import { google } from "@/lib/auth";
import { cookies } from "next/headers";
import User from "@/lib/models/User";
import { generateRandomString, alphabet } from "oslo/crypto";
import { connectDB } from "@/lib/mongoose";

const emails = ["mohdhashique10@gmail.com"];

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const storedState = cookies().get("google_oauth_state")?.value ?? null;
        const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

        // Validate required parameters
        if (!code || !state || !storedState || !codeVerifier) {
            return new Response(null, { status: 400 });
        }

        // Validate state matches
        if (state !== storedState) {
            return new Response(null, { status: 400 });
        }

        // Validate authorization code and get tokens
        let tokens;
        try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
        } catch (e) {
            console.error('Error validating authorization code:', e);
            return new Response(null, { status: 400 });
        }

        // Get the actual access token string
        let accessToken;
        try {
            // If tokens.accessToken is a function, call it
            if (typeof tokens.accessToken === 'function') {
                accessToken = tokens.accessToken();
            } else {
                // Otherwise use it directly
                accessToken = tokens.accessToken;
            }

            if (!accessToken || typeof accessToken !== 'string') {
                throw new Error('Invalid access token format');
            }
        } catch (e) {
            console.error('Error getting access token:', e);
            return new Response(null, { status: 500 });
        }

        // Fetch user info with proper authorization header
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: new Headers({
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            })
        });

        if (!response.ok) {
            console.error('Failed to fetch user info:', await response.text());
            return new Response(null, { status: 400 });
        }

        const claims = await response.json();
        const email = claims.email;

        // Check if email is authorized
        if (!emails.includes(email)) {
            return new Response(
                `<html><body>This email ${email} is not authorized <a href="/">Go To Home</a></body></html>`,
                {
                    headers: {
                        "Content-Type": "text/html",
                    },
                }
            );
        }

        // Connect to database
        await connectDB();

        // Find or create user
        let user = await User.findOne({ email: email });

        if (!user) {
            const userId = generateRandomString(10, alphabet("a-z", "0-9"));
            user = await User.create({
                _id: userId,
                email: email,
            });
        }

        // Create session and set cookie
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user._id);
        setSessionTokenCookie(sessionToken, session.expiresAt);

        // Redirect to admin page
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/admin",
            },
        });

    } catch (error) {
        console.error('OAuth callback error:', error);
        return new Response(null, { status: 500 });
    }
}