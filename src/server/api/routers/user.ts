import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import openai from "~/server/openai/client"


const PESONAL_SECTION_SYSTEM_STATEMENT = 'Use the folowing facts to create a short CV profile with no more than 50 words'

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
                },
                include: {
                    personal: true
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

            let personal = user?.personal ?? await ctx.prisma.personalEntry.create({
                data: {
                    userId: user.id,
                    prompt,
                    result: ''
                }
            })

            console.log(prompt)


            let result = 'GPT Not Specified';

            if(returnGPT) {
                const completion = await openai.chat.completions.create({
                    messages: [
                        {
                            role: 'system',
                            content: PESONAL_SECTION_SYSTEM_STATEMENT
                        },
                        {
                            role: 'user',
                            content: `${prompt}`
                        }
                    ],
                    model: 'gpt-3.5-turbo'
                });

                result = completion.choices[0]?.message.content ?? 'Unable to generate anything from this. Please try again.'

                await ctx.prisma.personalEntry.update({
                    where: {
                        id: personal.id
                    },
                    data: {
                        prompt,
                        result
                    }
                })
            } else {
                await ctx.prisma.personalEntry.update({
                    where: {
                        id: personal.id
                    },
                    data: {
                        prompt
                    }
                })
            }


            return result
        })
});
