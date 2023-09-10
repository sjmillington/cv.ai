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
            prompt: z.string().optional(),
            result: z.string().optional()
            }) 
        }))
        .mutation(async ({ ctx, input}) => {

            const { prompt, result } = input.data

            await ctx.prisma.personalEntry.upsert({
                where: {
                    userId: ctx.session.user.id
                },
                update: {
                    result,
                    prompt
                },
                create: {
                    userId: ctx.session.user.id,
                    prompt: prompt ?? '',
                    result: result ?? ''
                
                }
            })

        }),
    generateGPT: protectedProcedure
        .input(z.object({ data: z.object({
            prompt: z.string()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { prompt } = input.data

            if(!prompt || prompt === '') {
                throw new Error('invalid prompt')
            }

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

            const result = completion.choices[0]?.message.content

            console.log(result)
            if(result) {

              
                await ctx.prisma.personalEntry.update({
                    where: {
                        userId: ctx.session.user.id
                    },
                    data: {
                        result,
                    },
                })

                return result;
            }

        
            return 'Unable to generate anything from this. Please try again.'
        })
});
