export interface Client {
    name: string
    phone: string
    email: string
}

export interface Vehicle {
    make: string
    model: string
    year: number
    color: string
    vin: string
    stockRO?: string
    imageUrl?: string
}

export interface Service {
    name: string
    price: number
    description: string
    details?: string[]
    hours?: number
}

export interface Payment {
    date: string
    time?: string
    amount: number
    method: string
    tip?: number
}

export interface Invoice {
    id: string
    invoiceNumber: string
    date: string
    client: Client
    vehicle: Vehicle
    services: Service[]
    subtotal: number
    discount: number
    discountPercent: number
    tax: number
    taxRate: number
    total: number
    amountPaid: number
    status: "Paid" | "Pending" | "Overdue"

    repairedBy: string
    payments: Payment[]
}

