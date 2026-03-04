import { useMemo, useState } from 'react'
import { updateWorkerProfile } from '../lib/db'
import { useDBSnapshot } from '../lib/hooks'
import type { ServiceCategory, SessionUser, WorkerProfile } from '../lib/types'

const CATEGORIES: ServiceCategory[] = [
  'AC',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Cleaning',
  'Painting',
  'Appliance',
  'PestControl',
  'Other',
]

function splitSkills(raw: string) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function WorkerProfileForm({ user }: { user: SessionUser }) {
  const db = useDBSnapshot()

  const profile = useMemo(() => {
    return db.workers.find((w) => w.id === user.id)
  }, [db.workers, user.id])

  const [name, setName] = useState(profile?.name ?? user.name)
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? '')
  const [viber, setViber] = useState(profile?.viber ?? '')
  const [categories, setCategories] = useState<ServiceCategory[]>(profile?.categories ?? ['Other'])
  const [skillsRaw, setSkillsRaw] = useState((profile?.skills ?? []).join(', '))
  const [about, setAbout] = useState(profile?.about ?? '')
  const [promoPosterUrl, setPromoPosterUrl] = useState(profile?.promoPosterUrl ?? '')

  if (!profile) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
        Worker profile not found.
      </div>
    )
  }

  const toggleCategory = (c: ServiceCategory) => {
    setCategories((prev) => {
      const next = prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
      return next.length ? next : ['Other']
    })
  }

  const save = () => {
    const patch: Partial<Pick<WorkerProfile, 'name' | 'email' | 'phone' | 'whatsapp' | 'viber' | 'categories' | 'skills' | 'about' | 'promoPosterUrl'>> = {
      name: name.trim() || profile.name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      viber: viber.trim() || undefined,
      categories,
      skills: splitSkills(skillsRaw),
      about: about.trim() || undefined,
      promoPosterUrl: promoPosterUrl.trim() || undefined,
    }
    updateWorkerProfile({ workerId: user.id, patch })
  }

  return (
    <form
      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">My Profile</div>
          <div className="mt-1 text-xs text-white/60">Update your skills and contact details.</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
          Rating: {profile.ratingAvg.toFixed(1)} ({profile.ratingCount})
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/70">Name</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Email (optional)</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Phone</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 ..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">WhatsApp</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+91 ..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Viber</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={viber}
            onChange={(e) => setViber(e.target.value)}
            placeholder="+91 ..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/70">Promo poster image URL (optional)</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={promoPosterUrl}
            onChange={(e) => setPromoPosterUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`rounded-xl border px-3 py-2 text-sm ${
                  categories.includes(c)
                    ? 'border-white/20 bg-white/10'
                    : 'border-white/10 bg-transparent hover:bg-white/5'
                }`}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">Skills (comma separated)</label>
          <input
            className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={skillsRaw}
            onChange={(e) => setSkillsRaw(e.target.value)}
            placeholder="Leak fixing, Fan repair, ..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-white/70">About</label>
          <textarea
            className="min-h-[90px] w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell customers about your service, area, timings, etc."
          />
        </div>
      </div>

      <button className="mt-4 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90">
        Save Profile
      </button>
    </form>
  )
}
