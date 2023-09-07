import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    update: protectedProcedure
        .input(z.object({ data: z.object({
            name: z.string().optional(),
            phoneNumber: z.string().optional(),
            email: z.string().optional(),
            website: z.string().optional()
        }) }))
        .mutation(({ ctx, input }) => {

            const { data } = input

            console.log(data)
        
            return ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data
            })
        }),
    current: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session.user.id
                }
            })
        })
});
