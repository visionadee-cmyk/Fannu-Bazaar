import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Shield, FileText, Scale } from 'lucide-react'

interface DisclaimerPageProps {
  onBack: () => void
}

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
}

export default function DisclaimerPage({ onBack }: DisclaimerPageProps) {
  const sections = [
    {
      icon: Shield,
      title: 'Platform Role',
      content: 'Fannu Bazaar is a service marketplace platform that connects customers with service providers (workers). We do not provide the services ourselves, nor do we employ the workers listed on our platform. We act solely as an intermediary to facilitate connections between parties.'
    },
    {
      icon: Scale,
      title: 'User Responsibilities',
      content: 'Users are responsible for:\n• Verifying the credentials and qualifications of workers before hiring\n• Negotiating terms, pricing, and scope of work directly with workers\n• Ensuring compliance with all applicable laws and regulations\n• Maintaining respectful and professional communication\n• Paying for services as agreed upon with the worker'
    },
    {
      icon: FileText,
      title: 'Service Quality',
      content: 'While we provide a rating and review system to help identify quality workers, Fannu Bazaar does not guarantee the quality of work performed by service providers. We recommend customers:\n• Check worker ratings and reviews before hiring\n• Communicate expectations clearly\n• Request references or portfolio samples when applicable\n• Start with smaller jobs to establish trust'
    },
    {
      icon: AlertTriangle,
      title: 'Liability Limitation',
      content: 'To the maximum extent permitted by law, Fannu Bazaar shall not be liable for:\n• Any direct, indirect, incidental, or consequential damages\n• Losses arising from transactions between users\n• Damages to property or injuries during service provision\n• Disputes between customers and workers regarding payment or service quality\n• Any failure to perform services by workers'
    }
  ]

  return (
    <div className="min-h-screen" style={{ background: THEME.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-gray-200/50 bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Terms & Disclaimer</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl border-2 flex items-start gap-4"
          style={{ background: THEME.amberLight, borderColor: THEME.amber }}
        >
          <AlertTriangle className="w-8 h-8 flex-shrink-0" style={{ color: THEME.amber }} />
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Important Notice</h2>
            <p className="text-gray-700">
              Please read this disclaimer carefully before using Fannu Bazaar. By using our platform, 
              you acknowledge and agree to these terms.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
                  <section.icon className="w-5 h-5" style={{ color: THEME.primary }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
              </div>
              <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryLight }}>
              <Scale className="w-5 h-5" style={{ color: THEME.primary }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Payment Terms</h3>
          </div>
          <ul className="text-gray-600 space-y-2 list-disc list-inside">
            <li>All payments are made directly between customers and workers</li>
            <li>Fannu Bazaar does not process or hold any payments</li>
            <li>We recommend using secure payment methods and obtaining receipts</li>
            <li>Payment slip upload feature is for record-keeping purposes only</li>
            <li>Disputes regarding payments must be resolved between the parties</li>
          </ul>
        </motion.div>

        {/* Data Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Data Privacy</h3>
          <p className="text-gray-600 mb-4">
            We respect your privacy and are committed to protecting your personal information. 
            Contact details shared on the platform (phone, WhatsApp, Viber) are visible to matched 
            parties to facilitate service provision.
          </p>
          <p className="text-gray-600">
            By using Fannu Bazaar, you consent to sharing your contact information with workers 
            or customers you engage with through the platform.
          </p>
        </motion.div>

        {/* Agreement Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-6 rounded-2xl text-center"
          style={{ background: THEME.primaryLight }}
        >
          <p className="text-gray-700 font-medium mb-2">
            By using Fannu Bazaar, you agree to these terms and conditions.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: April 24, 2026
          </p>
        </motion.div>
      </div>
    </div>
  )
}
