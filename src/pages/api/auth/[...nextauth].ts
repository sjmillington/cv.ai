import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

const handler = NextAuth(authOptions);

export default handler