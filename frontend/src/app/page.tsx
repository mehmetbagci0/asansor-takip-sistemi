import Link from 'next/link'
import { Building2, ClipboardCheck, Wrench, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Asansör Takip Sistemi
          </h1>
          <p className="text-xl text-gray-600">
            QR kod tabanlı, modern asansör bakım ve takip platformu
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Building2 className="w-12 h-12" />}
            title="Asansör Yönetimi"
            description="Tüm asansörlerinizi tek bir platformdan yönetin"
            href="/dashboard/elevators"
          />
          <FeatureCard
            icon={<ClipboardCheck className="w-12 h-12" />}
            title="Bakım Takibi"
            description="46 maddelik kontrol listesi ile detaylı bakım kaydı"
            href="/dashboard/maintenances"
          />
          <FeatureCard
            icon={<Wrench className="w-12 h-12" />}
            title="Arıza Yönetimi"
            description="Arızaları kaydedin ve takip edin"
            href="/dashboard/faults"
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12" />}
            title="Raporlama"
            description="Excel ve PDF formatında detaylı raporlar"
            href="/dashboard"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Giriş Yap
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Demo Görüntüle
          </Link>
        </div>

        {/* Features List */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Özellikler</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Feature text="QR kod ile hızlı asansör tanıma" />
            <Feature text="JWT kimlik doğrulama sistemi" />
            <Feature text="PostgreSQL veritabanı" />
            <Feature text="Prisma ORM ile güvenli veri yönetimi" />
            <Feature text="Excel import/export desteği" />
            <Feature text="PDF rapor oluşturma" />
            <Feature text="Mobil uygulama desteği" />
            <Feature text="Responsive tasarım" />
            <Feature text="İmza alma özelliği" />
            <Feature text="Fotoğraf yükleme" />
            <Feature text="Bakım geçmişi takibi" />
            <Feature text="Fenni muayene takibi" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, href }: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer h-full">
        <div className="text-blue-600 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        className="w-5 h-5 text-green-500"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 13l4 4L19 7"></path>
      </svg>
      <span className="text-gray-700">{text}</span>
    </div>
  )
}
