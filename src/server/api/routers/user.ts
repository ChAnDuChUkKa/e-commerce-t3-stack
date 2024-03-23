import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
 
  createUser: publicProcedure
    .input(z.object({ name: z.string(),email:z.string(),password:z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    }),

    loginUser: publicProcedure
    .input(z.object({ email:z.string(),password:z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data=await ctx.db.user.findFirst({
        where:{
          email:input.email,
          password:input.password
        }
      })
      if(data===null){
        throw new TRPCError({
          code:'BAD_REQUEST',
          message:"Invalid Credentials"
        })
      }
      return data
    }),
});
