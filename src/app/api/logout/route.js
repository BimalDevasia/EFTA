import { deleteSessionTokenCookie, getSessionToken } from "@/lib/session";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import Session from "@/lib/models/Session";
import { connectDB } from "@/lib/mongoose";
export const GET = async () => {
    const token = getSessionToken();
    if (token && token.length > 0) {
        const sessionId = encodeHexLowerCase(
            sha256(new TextEncoder().encode(token))
        );
        await connectDB();
        await Session.deleteMany({
            _id: sessionId,
        });
        deleteSessionTokenCookie();
    }

    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
        },
    });
};