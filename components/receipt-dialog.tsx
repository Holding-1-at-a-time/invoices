import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Invoice, Payment } from "@/lib/types"

interface ReceiptDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: Invoice
    payment: Payment
}

export function ReceiptDialog({ open, onOpenChange, invoice, payment }: ReceiptDialogProps) {
    if (!payment) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gray-900 border-gray-800 text-gray-100 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl text-center">Payment Receipt</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-[#00AE98]">{formatCurrency(payment.amount)}</h3>
                        <p className="text-gray-400">Total amount</p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Stripe Verified Payment:</span>
                            <span>{payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Invoice Paid:</span>
                            <span>{formatCurrency(payment.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Tip Paid:</span>
                            <span>{formatCurrency(payment.tip || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Paid:</span>
                            <span>{formatCurrency(payment.amount + (payment.tip || 0))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Date & Time:</span>
                            <span>
                                {payment.date} {payment.time || ""}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Payment accepted by:</span>
                            <span>{invoice.client.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Company Name:</span>
                            <span>One Detail At A Time LLC</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Phone:</span>
                            <span>(210)469-9251</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Email:</span>
                            <span>Contact@onedetailatatime.com</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Invoice Number:</span>
                            <span>#{invoice.invoiceNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button className="bg-[#00AE98] hover:bg-[#00AE98]/90 text-white">
                        <Mail className="h-4 w-4 mr-2" />
                        EMAIL RECEIPT
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

