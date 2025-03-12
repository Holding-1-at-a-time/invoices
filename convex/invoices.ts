import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getEmbedding } from "./utils"

// Get all invoices with client and vehicle data
export const getAll = query({
    handler: async (ctx) => {
        const invoices = await ctx.db.query("invoices").collect()

        // Get all the related data in parallel
        const invoicesWithRelations = await Promise.all(
            invoices.map(async (invoice) => {
                const client = await ctx.db.get(invoice.clientId)
                const vehicle = await ctx.db.get(invoice.vehicleId)
                const payments = await ctx.db
                    .query("payments")
                    .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
                    .collect()

                return {
                    ...invoice,
                    client,
                    vehicle,
                    payments,
                }
            }),
        )

        return invoicesWithRelations
    },
})

// Get a single invoice by ID with all related data
export const getById = query({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        const invoice = await ctx.db.get(args.id)
        if (!invoice) return null

        const client = await ctx.db.get(invoice.clientId)
        const vehicle = await ctx.db.get(invoice.vehicleId)
        const payments = await ctx.db
            .query("payments")
            .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
            .collect()

        return {
            ...invoice,
            client,
            vehicle,
            payments,
        }
    },
})

// Search invoices by text
export const search = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        if (!args.query.trim()) {
            return await getAll(ctx, {})
        }

        const embedding = await getEmbedding(args.query)
        const results = await ctx.db
            .query("invoices")
            .withVectorSearch("search_invoices", { vector: embedding, limit: 10 })
            .collect()

        // Get all the related data in parallel
        const invoicesWithRelations = await Promise.all(
            results.map(async (invoice) => {
                const client = await ctx.db.get(invoice.clientId)
                const vehicle = await ctx.db.get(invoice.vehicleId)
                const payments = await ctx.db
                    .query("payments")
                    .filter((q) => q.eq(q.field("invoiceId"), invoice._id))
                    .collect()

                return {
                    ...invoice,
                    client,
                    vehicle,
                    payments,
                }
            }),
        )

        return invoicesWithRelations
    },
})

// Create a new invoice
export const create = mutation({
    args: {
        invoiceNumber: v.string(),
        date: v.string(),
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        serviceItems: v.array(
            v.object({
                serviceId: v.id("services"),
                name: v.string(),
                price: v.number(),
                description: v.string(),
                details: v.optional(v.array(v.string())),
                hours: v.optional(v.number()),
            }),
        ),
        subtotal: v.number(),
        discount: v.number(),
        discountPercent: v.number(),
        tax: v.number(),
        taxRate: v.number(),
        total: v.number(),
        amountPaid: v.number(),
        status: v.string(),
        repairedBy: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Create text for embedding
        const client = await ctx.db.get(args.clientId)
        const vehicle = await ctx.db.get(args.vehicleId)

        const textForEmbedding = `
      Invoice ${args.invoiceNumber} ${args.date}
      Client: ${client?.name} ${client?.phone} ${client?.email}
      Vehicle: ${vehicle?.year} ${vehicle?.make} ${vehicle?.model} ${vehicle?.color} ${vehicle?.vin}
      Services: ${args.serviceItems.map((s) => s.name).join(", ")}
      Total: ${args.total}
      Status: ${args.status}
      Repaired By: ${args.repairedBy}
      ${args.notes || ""}
    `

        const embedding = await getEmbedding(textForEmbedding)

        const invoiceId = await ctx.db.insert("invoices", {
            ...args,
            embedding,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        return invoiceId
    },
})

// Update an existing invoice
export const update = mutation({
    args: {
        id: v.id("invoices"),
        invoiceNumber: v.optional(v.string()),
        date: v.optional(v.string()),
        clientId: v.optional(v.id("clients")),
        vehicleId: v.optional(v.id("vehicles")),
        serviceItems: v.optional(
            v.array(
                v.object({
                    serviceId: v.id("services"),
                    name: v.string(),
                    price: v.number(),
                    description: v.string(),
                    details: v.optional(v.array(v.string())),
                    hours: v.optional(v.number()),
                }),
            ),
        ),
        subtotal: v.optional(v.number()),
        discount: v.optional(v.number()),
        discountPercent: v.optional(v.number()),
        tax: v.optional(v.number()),
        taxRate: v.optional(v.number()),
        total: v.optional(v.number()),
        amountPaid: v.optional(v.number()),
        status: v.optional(v.string()),
        repairedBy: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const invoice = await ctx.db.get(id)
        if (!invoice) throw new Error("Invoice not found")

        // If we're updating fields that would affect the embedding, regenerate it
        if (
            args.invoiceNumber ||
            args.date ||
            args.clientId ||
            args.vehicleId ||
            args.serviceItems ||
            args.total ||
            args.status ||
            args.repairedBy ||
            args.notes
        ) {
            const clientId = args.clientId || invoice.clientId
            const vehicleId = args.vehicleId || invoice.vehicleId

            const client = await ctx.db.get(clientId)
            const vehicle = await ctx.db.get(vehicleId)

            const serviceItems = args.serviceItems || invoice.serviceItems

            const textForEmbedding = `
        Invoice ${args.invoiceNumber || invoice.invoiceNumber} ${args.date || invoice.date}
        Client: ${client?.name} ${client?.phone} ${client?.email}
        Vehicle: ${vehicle?.year} ${vehicle?.make} ${vehicle?.model} ${vehicle?.color} ${vehicle?.vin}
        Services: ${serviceItems.map((s) => s.name).join(", ")}
        Total: ${args.total || invoice.total}
        Status: ${args.status || invoice.status}
        Repaired By: ${args.repairedBy || invoice.repairedBy}
        ${args.notes || invoice.notes || ""}
      `

            updates.embedding = await getEmbedding(textForEmbedding)
        }

        updates.updatedAt = Date.now()

        await ctx.db.patch(id, updates)
        return id
    },
})

// Delete an invoice
export const remove = mutation({
    args: { id: v.id("invoices") },
    handler: async (ctx, args) => {
        // First delete all related payments
        const payments = await ctx.db
            .query("payments")
            .filter((q) => q.eq(q.field("invoiceId"), args.id))
            .collect()

        for (const payment of payments) {
            await ctx.db.delete(payment._id)
        }

        // Then delete the invoice
        await ctx.db.delete(args.id)
        return args.id
    },
})

