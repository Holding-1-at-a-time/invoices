import { InvoiceDetail } from "@/components/invoice-detail"
import { notFound } from "next/navigation"
import { mockInvoices } from "@/lib/mock-data"

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
    const invoice = mockInvoices.find((inv) => inv.id === params.id)

    if (!invoice) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <InvoiceDetail invoice={invoice} />
            </div>
        </main>
    )
}

