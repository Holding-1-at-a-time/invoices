"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Printer, Mail, FileText, Info, Car, Receipt, ClipboardList } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Invoice } from "@/lib/types"
import { ReceiptDialog } from "./receipt-dialog"

interface InvoiceDetailProps {
    invoice: Invoice
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
    const router = useRouter()
    const [receiptOpen, setReceiptOpen] = useState(false)

    const handlePrint = () => {
        router.push(`/invoices/${invoice.id}/print`)
    }

    const handleEmail = () => {
        // Email functionality would be implemented here
        alert("Email invoice functionality would be implemented here")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-800">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Invoice Details</h1>
            </div>

            <Card className="bg-gray-900 border-gray-800 shadow-xl">
                <CardHeader className="border-b border-gray-800 pb-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl md:text-2xl text-[#00AE98]">
                                INVOICE #{invoice.invoiceNumber} - {invoice.date}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                                {invoice.client.name} • {invoice.client.phone}
                            </CardDescription>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                            <div className="text-2xl font-bold">{formatCurrency(invoice.total)}</div>
                            <Badge
                                className={
                                    invoice.status === "Paid"
                                        ? "bg-green-900 text-green-100 hover:bg-green-900"
                                        : "bg-amber-900 text-amber-100 hover:bg-amber-900"
                                }
                            >
                                {invoice.status}
                            </Badge>
                            {invoice.discount > 0 && (
                                <div className="text-sm text-gray-400">
                                    {invoice.discountPercent}% Discount: -{formatCurrency(invoice.discount)} | {invoice.taxRate}% Tax Rate
                                    +{formatCurrency(invoice.tax)}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid grid-cols-4 bg-gray-800">
                            <TabsTrigger value="details" className="data-[state=active]:bg-[#00AE98]">
                                <Info className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Details</span>
                            </TabsTrigger>
                            <TabsTrigger value="vehicle" className="data-[state=active]:bg-[#00AE98]">
                                <Car className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Vehicle</span>
                            </TabsTrigger>
                            <TabsTrigger value="services" className="data-[state=active]:bg-[#00AE98]">
                                <ClipboardList className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Services</span>
                            </TabsTrigger>
                            <TabsTrigger value="payment" className="data-[state=active]:bg-[#00AE98]">
                                <Receipt className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Payment</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Client Information</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="text-gray-400">Name:</span> {invoice.client.name}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Phone:</span> {invoice.client.phone}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Email:</span> {invoice.client.email}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Invoice Information</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="text-gray-400">Invoice Number:</span> {invoice.invoiceNumber}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Date:</span> {invoice.date}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Repaired By:</span> {invoice.repairedBy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="vehicle" className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="text-gray-400">Make:</span> {invoice.vehicle.make}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Model:</span> {invoice.vehicle.model}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Year:</span> {invoice.vehicle.year}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Color:</span> {invoice.vehicle.color}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">VIN:</span> {invoice.vehicle.vin}
                                        </p>
                                        <p>
                                            <span className="text-gray-400">Stock/RO:</span> {invoice.vehicle.stockRO || "None Added"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={invoice.vehicle.imageUrl || "/placeholder.svg?height=200&width=300"}
                                            alt={`${invoice.vehicle.year} ${invoice.vehicle.make} ${invoice.vehicle.model}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="services" className="pt-4">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Services</h3>

                                {invoice.services.map((service, index) => (
                                    <Card key={index} className="bg-gray-800 border-gray-700">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md font-medium flex justify-between">
                                                <span>{service.name}</span>
                                                <span>{formatCurrency(service.price)}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-300">{service.description}</p>
                                            {service.details && (
                                                <div className="mt-2 text-sm text-gray-400">
                                                    {service.details.map((detail, idx) => (
                                                        <p key={idx}>• {detail}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                <div className="pt-4 border-t border-gray-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal:</span>
                                        <span>{formatCurrency(invoice.subtotal)}</span>
                                    </div>
                                    {invoice.discount > 0 && (
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-400">Discount ({invoice.discountPercent}%):</span>
                                            <span>-{formatCurrency(invoice.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-400">Tax ({invoice.taxRate}%):</span>
                                        <span>+{formatCurrency(invoice.tax)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg mt-2">
                                        <span>Total:</span>
                                        <span className="text-[#00AE98]">{formatCurrency(invoice.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="payment" className="pt-4">
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Payment History</h3>

                                {invoice.payments.map((payment, index) => (
                                    <Card key={index} className="bg-gray-800 border-gray-700">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-md font-medium flex justify-between">
                                                <span>Payment</span>
                                                <span>{formatCurrency(payment.amount)}</span>
                                            </CardTitle>
                                            <CardDescription>
                                                {payment.date} • {payment.method}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter className="pt-2">
                                            <Button variant="outline" size="sm" className="ml-auto" onClick={() => setReceiptOpen(true)}>
                                                VIEW RECEIPT
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}

                                {invoice.payments.length === 0 && (
                                    <p className="text-gray-400">No payments recorded for this invoice.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

                <CardFooter className="border-t border-gray-800 pt-4 flex flex-wrap gap-2">
                    <Button className="bg-[#00AE98] hover:bg-[#00AE98]/90 text-white" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        PRINT INVOICE
                    </Button>
                    <Button variant="outline" onClick={handleEmail}>
                        <Mail className="h-4 w-4 mr-2" />
                        EMAIL INVOICE
                    </Button>
                    <Button variant="outline" onClick={() => router.push(`/invoices/${invoice.id}/pdf`)}>
                        <FileText className="h-4 w-4 mr-2" />
                        OPEN PDF
                    </Button>
                </CardFooter>
            </Card>

            <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} invoice={invoice} payment={invoice.payments[0]} />
        </div>
    )
}

