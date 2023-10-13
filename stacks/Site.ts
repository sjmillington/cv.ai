import { NextjsSite, StackContext } from "sst/constructs";


export default function Site({ stack }: StackContext) {

  const site = new NextjsSite(stack, "Site", {
    path: ".",
    environment: {
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL!,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET!,
        OPENAI_KEY: process.env.OPENAI_KEY!,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!
    },
    warm: 2
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  });
}