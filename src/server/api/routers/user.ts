import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import openai from "~/server/openai/client"

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
        }),
    personalSection: protectedProcedure
        .input(z.object({ data: z.object({
            
            prompt: z.string(),
            returnGPT: z.boolean()

        }) }))
        .mutation(async ({ ctx, input }) => {

            const { prompt, returnGPT } = input.data

            const user = await ctx.prisma.user.findFirst({
                include: {
                    personal: true
                },
                where: {
                    id: ctx.session.user.id
                }
            })

            if(user === null) {
                throw new Error('No user?!')
            }

            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Generate a single paragraph in the third person in the style of a personal section of a professional curriculum vitae'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                model: 'gpt-3.5-turbo'
            });

            const result = completion.choices[0]?.message.content ?? 'Unable to generate anything from this. Please try again.'

            if(!user.personal) {
                await ctx.prisma.personalEntry.create({
                    data: {
                        userId: user.id,
                        prompt,
                        result
                    }
                })
            } else {
                await ctx.prisma.personalEntry.update({
                    where: {
                        id: user.personal.id
                    },
                    data: {
                        prompt,
                        result
                    }
                })
            }

            return result
        })
});
