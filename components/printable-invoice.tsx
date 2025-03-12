"use client"

import { useEffect } from "react"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import type { Invoice } from "@/lib/types"

interface PrintableInvoiceProps {
    invoice: Invoice
}

export function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
    useEffect(() => {
        // Automatically trigger print dialog when component mounts
        setTimeout(() => {
            window.print()
        }, 500)
    }, [])

    return (
        <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold">One Detail At A Time LLC</h1>
                    <p>Shop: 245 Larchmont Drive, San Antonio, Texas, 78203</p>
                    <p>Mailing: 245 Larchmont Drive, San Antonio, Texas, 78209</p>
                    <p>https://www.1detailatatime.com | Contact@onedetailatatime.com</p>
                    <p>Phone: (210)469-9251</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Invoice# {invoice.invoiceNumber}</p>
                    <p>Date Created: {invoice.date}</p>
                    <p>P.O.#:</p>
                </div>
            </div>

            {/* Client Info */}
            <div className="mb-8">
                <h2 className="font-bold text-lg mb-2">{invoice.client.name}</h2>
                <p>
                    {invoice.client.phone} | {invoice.client.email}
                </p>
            </div>

            {/* Vehicle Info */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1">
                    <h2 className="font-bold text-lg mb-2">
                        {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}, {invoice.vehicle.color}
                    </h2>
                    <p>VIN: {invoice.vehicle.vin}</p>
                    <p>Odometer:</p>
                    <p>Stock/RO#: {invoice.vehicle.stockRO || "None Added"}</p>
                    <p>License:</p>
                </div>
                <div className="w-1/3 relative h-32">
                    <Image
                        src={invoice.vehicle.imageUrl || "/placeholder.svg?height=200&width=300"}
                        alt={`${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}`}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Services Summary */}
            <div className="mb-8">
                <h2 className="font-bold text-lg mb-2">Services Summary:</h2>

                {invoice.services.map((service, index) => (
                    <div key={index} className="mb-4">
                        <p className="font-bold">
                            {service.name}: {formatCurrency(service.price)}
                        </p>
                        <p>{service.description}</p>
                        {service.details && (
                            <ul className="list-disc pl-5 mt-2">
                                {service.details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Repaired By */}
            <div className="mb-8">
                <p>
                    <strong>Repaired By:</strong> {invoice.repairedBy}
                </p>
            </div>

            {/* Invoice Totals */}
            <div className="border-t border-gray-300 pt-4">
                <h2 className="font-bold text-lg mb-2">Invoice Totals</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="text-left py-2">Service Type</th>
                            <th className="text-left py-2">Rate</th>
                            <th className="text-left py-2">Hours</th>
                            <th className="text-right py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.services.map((service, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{service.name}</td>
                                <td className="py-2">{formatCurrency(service.price)}</td>
                                <td className="py-2">{service.hours || "-"}</td>
                                <td className="text-right py-2">{formatCurrency(service.price)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3} className="text-right py-2 font-bold">
                                Subtotal:
                            </td>
                            <td className="text-right py-2">{formatCurrency(invoice.subtotal)}</td>
                        </tr>
                        {invoice.discount > 0 && (
                            <tr>
                                <td colSpan={3} className="text-right py-2">
                                    Discount ({invoice.discountPercent}%):
                                </td>
                                <td className="text-right py-2">-{formatCurrency(invoice.discount)}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan={3} className="text-right py-2">
                                Tax ({invoice.taxRate}%):
                            </td>
                            <td className="text-right py-2">{formatCurrency(invoice.tax)}</td>
                        </tr>
                        <tr className="font-bold">
                            <td colSpan={3} className="text-right py-2">
                                Total:
                            </td>
                            <td className="text-right py-2">{formatCurrency(invoice.total)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} className="text-right py-2">
                                Amount Paid:
                            </td>
                            <td className="text-right py-2">{formatCurrency(invoice.amountPaid)}</td>
                        </tr>
                        <tr className="font-bold">
                            <td colSpan={3} className="text-right py-2">
                                Balance Due:
                            </td>
                            <td className="text-right py-2">{formatCurrency(invoice.total - invoice.amountPaid)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-600">
                <p>Thank you for your business!</p>
            </div>
        </div>
    )
}

