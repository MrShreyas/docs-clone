import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { mutation, query } from "./_generated/server";

export const getByIds = query({
  args: {ids: v.array(v.id("templates"))},
  handler: async (ctx, {ids}) => {
    const templates = []

    for(const id of ids){
      const template = await ctx.db.get(id)
      if (template){
        templates.push({id: template._id, name: template.title})
      } else{
        templates.push({id, name: "[Removed]"})
      }
    }

    return templates
  }
})

export const create = mutation({
  args: {title: v.optional(v.string()), initialContent: v.optional(v.string())},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    return await ctx.db.insert("templates", {
      title: args.title ?? "Untitled Template",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent ,
    })
  }
})

export const get = query({
  args: {paginationOpts: paginationOptsValidator, search: v.optional(v.string())},
  handler: async (ctx, {search, paginationOpts}) => {

    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    if(search && organizationId){
      return await ctx.db
        .query("templates")
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("organizationId", organizationId)
        )
        .paginate(paginationOpts)
    }
    
    if(search){
      return await ctx.db
      .query("templates")
      .withSearchIndex("search_title", (q) => 
        q.search("title", search).eq("ownerId", user.subject))
      .paginate(paginationOpts);
    }

    if (organizationId) {
      return await ctx.db
      .query("templates")
      .withIndex("by_organization_id",(q) => 
        q.eq("organizationId",organizationId)
      )
      .paginate(paginationOpts);
    }

    return await ctx.db
      .query("templates")
      .withIndex("by_ownerId",(q) => 
        q.eq("ownerId",user.subject))
      .paginate(paginationOpts);
  },
});

export const removeById = mutation({
  args: {id: v.id("templates")},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const template = await ctx.db.get(args.id);

    if(!template) {
      throw new ConvexError("Document not found");
    }

    const isOwner = template.ownerId === user.subject
    const isOrganizationMember = !!(template.organizationId && template.organizationId === organizationId)
    if(!isOwner &&isOrganizationMember ) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.delete( args.id);
  }
})

export const updateById = mutation({
  args: {id: v.id("templates"), title: v.string()},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if(!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization_id ?? undefined) as
      | string
      | undefined;

    const template = await ctx.db.get(args.id);

    if(!template) {
      throw new ConvexError("Document not found");
    }

    const isOwner = template.ownerId === user.subject
    const isOrganizationMember = !!(template.organizationId && template.organizationId === organizationId)
    if(!isOwner &&isOrganizationMember ) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch( args.id, {title: args.title});
  }
})

export const getById = query({
  args: {id: v.id("templates")},
  handler: async (ctx, {id}) => {
    const template = await ctx.db.get(id)

    if(!template){
      throw new ConvexError("Document not found")
    }
    return template 
  }
})
