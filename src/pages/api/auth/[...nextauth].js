import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,

            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    session: {
        maxAge: 7 * 24 * 60 * 60, // One week
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google' && profile.email_verified) {
                if (profile.email.endsWith('@assi.ee')) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
    }
})
