// import bcrypt from 'bcrypt';
import { UserType } from 'lib/query/types';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUser } from '~/lib/query/admin';

let currentUser: UserType;
let accessToken: string;

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: 'email', type: 'email', placeholder: '' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (credentials !== null && credentials !== undefined) {
                    const email = credentials?.email;
                    const password = credentials?.password;
                    const user = email && (await getUser({ email, password }));

                    if (!user) {
                        throw new Error('UserNotFound');
                    }

                    currentUser = { ...user };
                    accessToken = user.token;
                    return user;
                }

                return null;
            },
        }),
    ],
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    session: {
        // Use JSON Web Tokens for session instead of database sessions.
        // This option can be used with or without a database for users/accounts.
        // Note: `strategy` should be set to 'jwt' if no database is used.
        strategy: 'jwt',

        // Seconds - How long until an idle session expires and is no longer valid.
        // maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        // updateAge: 24 * 60 * 60, // 24 hours
    },

    pages: {
        signIn: '/login', // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //   return true;
        // },
        async session({ session, token, user }) {
            // console.log('auth session', { session, token });
            return {
                ...session,
                user: {
                    ...user,
                    name: token.name,
                    email: token.email,
                },
                accessToken: token.accessToken,
            };
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.accessToken = user.token;
            }

            return token;
        },
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    // Enable debug messages in the console if you are having problems
    debug: true,
};

export default NextAuth(authOptions);
