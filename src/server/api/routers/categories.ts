import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categories = createTRPCRouter({
  getAll: publicProcedure
  .input(z.object({num:z.number(),userId:z.number()}))
  .query(async({ ctx,input }) => {

    const userCategoriesDatadata=await ctx.db.userCategories.findMany({
      where:{
        userId:input.userId
      }
    })

    const categoriesData=await ctx.db.category.findMany({
        skip: input.num + input.num*6,
        take: 6,
    });

    return categoriesData.map((eachCategory)=>{
      return {
        id:eachCategory.id,
        name:eachCategory.name,
        isInterested:userCategoriesDatadata.filter(c=>c.categoryId===eachCategory.id).length>0,
      }
    })

  }),

  updateCategory:publicProcedure
  .input(z.object({categoryId: z.number() ,userId : z.number(),isInterested:z.boolean()}))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));
if (input.isInterested) {
return  ctx.db.userCategories.create({
    data:{
      assignedBy:input.userId.toString(),
      categoryId:input.categoryId,
      userId:input.userId
    }
  })
} else {
  return ctx.db.userCategories.delete({
    where:{
      userId_categoryId:{userId:input.userId, categoryId:input.categoryId}

    }
  })
}
  })
});
