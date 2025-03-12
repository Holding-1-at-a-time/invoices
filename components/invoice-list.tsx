"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"
import { mockInvoices } from "@/lib/mock-data"

export function InvoiceList() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredInvoices = mockInvoices.filter(
        (invoice) =>
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h2 className="text-2xl font-semibold">Invoices</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search invoices..."
                        className="pl-8 bg-gray-900 border-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {filteredInvoices.map((invoice) => (
                    <Card
                        key={invoice.id}
                        className="bg-gray-900 border-gray-800 hover:border-[#00AE98] transition-all cursor-pointer shadow-lg hover:shadow-[#00AE98]/10"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-medium">
                                    INVOICE #{invoice.invoiceNumber} - {invoice.date}
                                </CardTitle>
                                <Badge
                                    className={
                                        invoice.status === "Paid"
                                            ? "bg-green-900 text-green-100 hover:bg-green-900"
                                            : "bg-amber-900 text-amber-100 hover:bg-amber-900"
                                    }
                                >
                                    {invoice.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Client</p>
                                    <p className="font-medium">{invoice.client.name}</p>
                                    <p className="text-sm text-gray-400">{invoice.client.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Vehicle</p>
                                    <p className="font-medium">
                                        {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                                    </p>
                                    <p className="text-sm text-gray-400">{invoice.vehicle.color}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Amount</p>
                                    <p className="text-2xl font-bold text-[#00AE98]">{formatCurrency(invoice.total)}</p>
                                    {invoice.discount > 0 && (
                                        <p className="text-sm text-gray-400">
                                            {invoice.discountPercent}% Discount: -{formatCurrency(invoice.discount)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

