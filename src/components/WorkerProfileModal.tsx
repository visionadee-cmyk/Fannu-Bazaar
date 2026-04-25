import { useMemo, useState } from 'react'
import { useDBSnapshot } from '../lib/hooks'
import { Phone, Mail, MapPin, Star, Clock, CheckCircle, Award, Briefcase, X, MessageCircle, Languages, Building2, Calendar, Shield, ThumbsUp } from 'lucide-react'

export default function WorkerProfileModal({ workerId, onClose }: { workerId: string; onClose: () => void }) {
  const db = useDBSnapshot()
  const [showAllReviews, setShowAllReviews] = useState(false)
  const worker = useMemo(() => db.workers.find((w) => w.id === workerId), [db.workers, workerId])

  if (!worker) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-white max-w-md w-full">
          <div className="text-sm font-semibold">Worker not found</div>
          <button className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    )
  }

  const reviews = useMemo(() => db.reviews.filter((r) => r.workerId === worker.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [db.reviews, worker.id])
  const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 10)

  const phone = worker.contactInfo?.phone || worker.phone
  const whatsapp = worker.contactInfo?.whatsapp || worker.whatsapp
  const email = worker.contactInfo?.email || worker.email

  // Generate profile image using UI Avatars API
  const businessName = worker.businessName || worker.name || 'Worker'
  const profileImageUrl = worker.profileImage || worker.promoPosterUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=10b981&color=fff&size=200&bold=true&font-size=0.4`

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-t-3xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm z-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-6 pb-6 -mt-16 relative">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <img 
                  src={profileImageUrl}
                  alt={businessName}
                  className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl object-cover"
                />
                {worker.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Business Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 truncate">{businessName}</h2>
                {worker.tagline && (
                  <p className="text-gray-600 mt-1 text-sm">{worker.tagline}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{worker.ratingAvg.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({worker.ratingCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>{worker.jobsDone} jobs</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${worker.active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {worker.active ? 'Active Now' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Call</span>
                </a>
              )}
              {whatsapp && (
                <a 
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                </a>
              )}
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="flex flex-col items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-6 pb-6 space-y-5">
          {/* Services */}
          {worker.services && worker.services.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Services & Pricing
              </h3>
              <div className="space-y-3">
                {worker.services.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors">
                    <span className="font-medium text-gray-800">{service.name}</span>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600">
                        {service.price > 0 ? `${service.currency} ${service.price}` : 'Get Quote'}
                      </span>
                      {service.unit && service.price > 0 && (
                        <span className="text-gray-500 text-xs ml-1">/{service.unit}</span>
                      )}
                      {service.originalPrice && (
                        <span className="text-gray-400 line-through ml-2 text-sm">{service.currency} {service.originalPrice}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promo Offer */}
          {worker.promotionalOffer?.active && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-800">🎉 Special Offer</h3>
              </div>
              <p className="text-gray-700 font-medium">{worker.promotionalOffer.title}: {worker.promotionalOffer.description}</p>
              {worker.promotionalOffer.validUntil && (
                <p className="text-amber-600 text-sm mt-2">⏰ Valid until: {worker.promotionalOffer.validUntil}</p>
              )}
            </div>
          )}

          {/* Contact & Location */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Contact Info
              </h3>
              <div className="space-y-3">
                {phone && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-semibold text-gray-900">{phone}</div>
                    </div>
                  </div>
                )}
                {worker.contactInfo?.secondaryPhone && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Secondary</div>
                      <div className="font-semibold text-gray-900">{worker.contactInfo.secondaryPhone}</div>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-semibold text-gray-900 text-sm">{email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {worker.locationInfo && (
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Location
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Area</div>
                      <div className="font-semibold text-gray-900">
                        {worker.locationInfo.island}, {worker.locationInfo.atoll}
                      </div>
                    </div>
                  </div>
                  {worker.locationInfo.address && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Address</div>
                        <div className="font-medium text-gray-900 text-sm">{worker.locationInfo.address}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Service Area</div>
                      <div className="font-medium text-gray-900 text-sm">{worker.locationInfo.serviceArea}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          {worker.availability && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Availability
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Working Days</div>
                    <div className="font-semibold text-gray-900">{worker.availability.days.join(', ')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Working Hours</div>
                    <div className="font-semibold text-gray-900">{worker.availability.hours}</div>
                  </div>
                </div>
              </div>
              {worker.availability.emergencyService && (
                <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  24/7 Emergency Service Available
                </div>
              )}
            </div>
          )}

          {/* Categories & Skills */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {worker.categories.map((cat) => (
                  <span key={cat} className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5 text-cyan-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.languages && worker.languages.length > 0 ? (
                  worker.languages.map((lang) => (
                    <span key={lang} className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                      {lang}
                    </span>
                  ))
                ) : (
                  worker.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Warranty Info */}
          {worker.warranty?.available && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Warranty Available</h3>
                  <p className="text-blue-700 text-sm">{worker.warranty.description || `${worker.warranty.durationDays} days warranty`}</p>
                </div>
              </div>
            </div>
          )}

          {/* About */}
          {(worker.about || worker.description) && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {worker.about || worker.description}
              </p>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Customer Reviews ({reviews.length})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {reviewsToShow.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {('customerName' in rev && (rev as any).customerName) ? ((rev as any).customerName as string).charAt(0) : 'U'}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(rev.rating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs font-semibold text-gray-600 ml-1">({rev.rating}/10)</span>
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-gray-700 text-sm">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
              {reviews.length > 10 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {showAllReviews ? 'Show Less' : `Load More Reviews (${reviews.length - 10} more)`}
                </button>
              )}
            </div>
          )}

          {/* No Reviews */}
          {reviews.length === 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">No reviews yet</h3>
              <p className="text-gray-500 text-sm">Be the first to review this worker!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
