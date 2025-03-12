import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    clients: defineTable({
        name: v.string(),
        phone: v.string(),
        email: v.string(),
        address: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        zip: v.optional(v.string()),
        notes: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).vectorIndex("search_clients", {
        vectorField: "embedding",
        dimensions: 1536,
    }),

    vehicles: defineTable({
        clientId: v.id("clients"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        color: v.string(),
        vin: v.string(),
        stockRO: v.optional(v.string()),
        licensePlate: v.optional(v.string()),
        odometer: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    services: defineTable({
        name: v.string(),
        description: v.string(),
        defaultPrice: v.number(),
        details: v.optional(v.array(v.string())),
        category: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    invoices: defineTable({
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
        createdAt: v.number(),
        updatedAt: v.number(),
    }).vectorIndex("search_invoices", {
        vectorField: "embedding",
        dimensions: 1536,
    }),

    payments: defineTable({
        invoiceId: v.id("invoices"),
        date: v.string(),
        time: v.optional(v.string()),
        amount: v.number(),
        method: v.string(),
        tip: v.optional(v.number()),
        notes: v.optional(v.string()),
        createdAt: v.number(),
    }),
})

