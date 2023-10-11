import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { PERSONAL_SECTION_PARAMS, runGTP } from "./user";

export const publicRouter = createTRPCRouter({
  try: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {

      const { text } = input

      if(!text || text === '') {
          throw new Error('invalid text')
      }

      const result = await runGTP(text, PERSONAL_SECTION_PARAMS)

      return result;
    }),
});
