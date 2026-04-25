import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MessageCircle, MessageSquare, ExternalLink } from 'lucide-react'

interface ContactPageProps {
  onBack: () => void
}

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'retey.ay@hotmail.com',
      link: 'mailto:retey.ay@hotmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone / WhatsApp',
      value: '9795529',
      link: 'https://wa.me/9609795529',
      description: 'Call or message on WhatsApp'
    },
    {
      icon: MessageCircle,
      title: 'Viber',
      value: '9795529',
      link: 'viber://chat?number=9609795529',
      description: 'Chat with us on Viber'
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
            <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
            <MessageSquare className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">
            Have questions or need help? We're here to assist you.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="space-y-4 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.link}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: THEME.primaryLight }}>
                <method.icon className="w-7 h-7" style={{ color: THEME.primary }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                <p className="text-xl font-bold" style={{ color: THEME.primary }}>{method.value}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </motion.a>
          ))}
        </div>

        {/* Office Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Support Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl" style={{ background: THEME.primaryLight }}>
              <p className="font-semibold text-gray-900 mb-1">Sunday - Thursday</p>
              <p className="text-2xl font-bold" style={{ color: THEME.primary }}>8:00 AM - 6:00 PM</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <p className="font-semibold text-gray-900 mb-1">Friday - Saturday</p>
              <p className="text-2xl font-bold text-gray-600">10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Response Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            We typically respond within <span className="font-semibold" style={{ color: THEME.primary }}>24 hours</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
