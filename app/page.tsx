import { InvoiceList } from "@/components/invoice-list"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#00AE98]">Invoice Management</h1>
        <InvoiceList />
      </div>
    </main>
  )
}

