import { PrintableInvoice } from "@/components/printable-invoice"
import { notFound } from "next/navigation"
import { mockInvoices } from "@/lib/mock-data"

export default function PDFInvoicePage({ params }: { params: { id: string } }) {
    const invoice = mockInvoices.find((inv) => inv.id === params.id)

    if (!invoice) {
        notFound()
    }

    return <PrintableInvoice invoice={invoice} />
}