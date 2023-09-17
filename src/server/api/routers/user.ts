import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import openai from "~/server/openai/client"

const PESONAL_SECTION_SYSTEM_STATEMENT = 'Use the folowing facts to create a short CV profile with no more than 50 words'
const WORK_ENTRY_SYSTEM_STATEMENT = 'Use the following facts to create a CV work section. Format into an bullet pointed list. Use a maximum of 3 bullet points. Each bullet point should be less than 30 words.'
const EDUCATION_SYSTEM_STATEMENT = 'Use the following facts to create a CV university section. Format into an bullet pointed list with a maximum of 3 bullet points. Each bullet point should be less than 30 words.'

const runGTP = async (prompt: string, statement: string): Promise<string | undefined> => {
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: statement
            },
            {
                role: 'user',
                content: `${prompt}`
            }
        ],
        model: 'gpt-3.5-turbo'
    });

    return completion.choices[0]?.message.content ?? undefined
}

export const userRouter = createTRPCRouter({
    update: protectedProcedure
        .input(z.object({ data: z.object({
            name: z.string().optional(),
            phoneNumber: z.string().optional(),
            email: z.string().optional(),
            website: z.string().optional(),
            skills: z.array(z.string()).optional()
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
                    personal: true,
                    workEntries: {
                        orderBy: {
                            start: 'desc'
                        }
                    },
                    education: true
                },
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
    personalSectionGTP: protectedProcedure
        .input(z.object({ data: z.object({
            prompt: z.string()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { prompt } = input.data

            if(!prompt || prompt === '') {
                throw new Error('invalid prompt')
            }

            const result = await runGTP(prompt, PESONAL_SECTION_SYSTEM_STATEMENT)
        
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
        }),
    addWorkEntry: protectedProcedure
        .mutation(async ({ ctx }) => {
            
            return await ctx.prisma.workEntry.create({
                data: {
                    prompt: '',
                    userId: ctx.session.user.id
                }
            })
        }),
    deleteWorkEntry: protectedProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ ctx, input: { id } }) => {

            await ctx.prisma.workEntry.delete({
                where: {
                    id
                }
            })

        }),
    updateWorkEntry: protectedProcedure
        .input(z.object({ 
            id: z.string(),
            data: z.object({
                role: z.string().optional(),
                company: z.string().optional(),
                start: z.date().optional(),
                end: z.date().optional(),
                prompt: z.string().optional(),
                result: z.string().optional()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { id, data } = input

            return await ctx.prisma.workEntry.update({
                where: {
                    id
                },
                data
            })
            
        }),
    workEntryGPT: protectedProcedure
        .input(z.object({ 
            id: z.string(),
            data: z.object({
                prompt: z.string()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { prompt } = input.data

            if(!prompt || prompt === '') {
                throw new Error('invalid prompt')
            }

            const result = await runGTP(prompt, WORK_ENTRY_SYSTEM_STATEMENT)
        
            if(result) {              
                await ctx.prisma.workEntry.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        result,
                    },
                })

                return result;
            }

        
            return 'Unable to generate anything from this. Please try again.'
        }),
    education: protectedProcedure
        .input(z.object({ 
            data: z.object({
                course: z.string().optional(),
                institution: z.string().optional(),
                start: z.date().optional(),
                end: z.date().optional(),
                prompt: z.string().optional(),
                result: z.string().optional(),
                grade: z.string().optional()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { 
                course, 
                institution,
                start,
                end,
                prompt,
                result,
                grade
            
            } = input.data

            await ctx.prisma.educationEntry.upsert({
                where: {
                    userId: ctx.session.user.id
                },
                update: {
                    course,
                    institution,
                    start,
                    end,
                    prompt,
                    result,
                    grade
                },
                create: {
                    userId: ctx.session.user.id,
                    course,
                    institution,
                    start,
                    end,
                    grade,
                    prompt: prompt ?? '',
                    result
                }
            })

        }),
    educationGTP: protectedProcedure
        .input(z.object({ 
            data: z.object({
                prompt: z.string()
            }) 
        }))
        .mutation(async ({ ctx, input }) => {

            const { prompt } = input.data

            if(!prompt || prompt === '') {
                throw new Error('invalid prompt')
            }

            const result = await runGTP(prompt, EDUCATION_SYSTEM_STATEMENT)

            console.log(result)
        
            if(result) {              
                await ctx.prisma.educationEntry.update({
                    where: {
                        userId: ctx.session.user.id
                    },
                    data: {
                        prompt,
                        result,
                    },
                })

                return result;
            }

        
            return 'Unable to generate anything from this. Please try again.'
        }),
});
