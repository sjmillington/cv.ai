# OpenAI CV Generator

This project provides a helpful UI wrapper around chat GPT for generating your own CV.

**This is very much still a work in progress!**

Bootstrapped with [T3 Stack](https://create.t3.gg/)

## Technology Used

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [OpenAI-Node](https://github.com/openai/openai-node)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [DaisyUI](https://daisyui.com)
- [tRPC](https://trpc.io)


## Environment Variables

This website is currently configured to allow login with either Discord or Google. More options may be added simply with NextAuth Providers.

```
POSTGRES_PRISMA_URL="" # A running postgres db.
# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000" #locally this is fine.

# Next Auth Discord Provider
DISCORD_CLIENT_ID="" 
DISCORD_CLIENT_SECRET=""

OPENAI_KEY="" #OpenAI API Kit
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```






