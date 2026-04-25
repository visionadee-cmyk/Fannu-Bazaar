import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, Users, Star, Shield, Clock, Globe } from 'lucide-react'

interface AboutPageProps {
  onBack: () => void
}

const THEME = {
  primary: '#10B981',
  primaryDark: '#059669',
  primaryLight: '#D1FAE5',
  bg: '#F0FDF4',
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const features = [
    {
      icon: Briefcase,
      title: '60+ Service Categories',
      description: 'From AC repair to event planning, find skilled workers for any job.'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Connect with verified workers and customers in your area.'
    },
    {
      icon: Star,
      title: 'Rating System',
      description: 'Review and rate workers to maintain quality standards.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected.'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications on job progress.'
    },
    {
      icon: Globe,
      title: 'Dhivehi & English',
      description: 'Use the app in your preferred language.'
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
            <h1 className="text-xl font-bold text-gray-900">About Fannu Bazaar</h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: THEME.primary }}>
            <Briefcase className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fannu Bazaar</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted marketplace for connecting customers with skilled workers. 
            We make it easy to find, hire, and pay for professional services.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: THEME.primaryLight }}>
                <feature.icon className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: THEME.primary }}>1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Post a Request</h4>
              <p className="text-sm text-gray-600">Describe what you need and set your budget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: THEME.primary }}>2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Get Quotes</h4>
              <p className="text-sm text-gray-600">Receive quotations from interested workers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: THEME.primary }}>3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Hire & Pay</h4>
              <p className="text-sm text-gray-600">Choose the best worker and pay securely</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Version 2.2 • Built with ❤️ for the Maldives</p>
        </motion.div>
      </div>
    </div>
  )
}
