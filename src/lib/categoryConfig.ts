import type { ServiceCategory } from './types'

export type CategoryMeta = {
  category: ServiceCategory
  filename: string
  blurb: string
  subcategories: string[]
}

export const CATEGORY_CONFIG: CategoryMeta[] = [
  {
    category: 'AC',
    filename: 'Maintenance-bro.svg',
    blurb: 'Cooling & AC repair',
    subcategories: ['Installation', 'Gas refill', 'Not cooling', 'Cleaning/service', 'Compressor issue', 'General maintenance'],
  },
  {
    category: 'Plumbing',
    filename: 'Pipeline%20maintenance-amico.svg',
    blurb: 'Leaks, fittings, water',
    subcategories: ['Leak fixing', 'Tap replacement', 'Toilet repair', 'Drain blockage', 'Water heater', 'Pipe fitting'],
  },
  {
    category: 'Electrical',
    filename: 'Electrician-cuate.svg',
    blurb: 'Wiring, lights, power',
    subcategories: ['Wiring', 'Switchboard', 'Lights', 'Fan repair', 'Socket issue', 'CCTV install'],
  },
  {
    category: 'Carpentry',
    filename: 'Measure-amico.svg',
    blurb: 'Woodwork & fittings',
    subcategories: ['Furniture repair', 'Door/lock adjustment', 'Shelves/cabinets', 'Curtain rods', 'Hinges', 'Custom work'],
  },
  {
    category: 'Cleaning',
    filename: 'Laundry%20and%20dry%20cleaning-pana.svg',
    blurb: 'Home & office cleaning',
    subcategories: ['Deep cleaning', 'Regular cleaning', 'Sofa/mattress', 'Post-construction', 'Office cleaning', 'Move-in/out'],
  },
  {
    category: 'Painting',
    filename: 'Scaffold-amico.svg',
    blurb: 'Walls, touch-ups',
    subcategories: ['Interior painting', 'Exterior painting', 'Touch-up', 'Waterproofing', 'Ceiling', 'Wood polish'],
  },
  {
    category: 'Appliance',
    filename: 'Construction%20costs-amico.svg',
    blurb: 'Appliance repair',
    subcategories: ['Washing machine', 'Fridge', 'Microwave', 'TV', 'Water dispenser', 'Small appliances'],
  },
  {
    category: 'PestControl',
    filename: 'Firefighter-cuate.svg',
    blurb: 'Pest control service',
    subcategories: ['Cockroaches', 'Bed bugs', 'Termites', 'Mosquito', 'Rodents', 'General spray'],
  },
  {
    category: 'Masonry',
    filename: 'Bricklayer-amico.svg',
    blurb: 'Brick & tile works',
    subcategories: ['Tile fixing', 'Grouting', 'Plastering', 'Brick work', 'Concrete repair', 'Small renovations'],
  },
  {
    category: 'Welding',
    filename: 'Construction%20worker-cuate.svg',
    blurb: 'Metal welding',
    subcategories: ['Gate welding', 'Railing', 'Steel fabrication', 'Repair welding', 'Stainless steel', 'Custom work'],
  },
  {
    category: 'Moving',
    filename: 'Heavy%20box-amico.svg',
    blurb: 'Moving & delivery',
    subcategories: ['House shifting', 'Office shifting', 'Pickup & drop', 'Packing help', 'Furniture moving', 'Heavy items'],
  },
  {
    category: 'IT',
    filename: 'Processing-cuate.svg',
    blurb: 'Tech support',
    subcategories: ['Laptop/PC repair', 'Wi‑Fi setup', 'Printer setup', 'Software install', 'Data recovery', 'Phone setup'],
  },
  {
    category: 'Beauty',
    filename: 'Hairdresser-cuate.svg',
    blurb: 'Salon at home',
    subcategories: ['Haircut', 'Hair color', 'Makeup', 'Henna', 'Facial', 'Bridal package'],
  },
  {
    category: 'Photography',
    filename: 'Camera-amico.svg',
    blurb: 'Photo & video',
    subcategories: ['Event photography', 'Portraits', 'Product shoots', 'Video recording', 'Editing', 'Drone'],
  },
  {
    category: 'Tutoring',
    filename: 'World%20Youth%20Skills%20Day-amico.svg',
    blurb: 'Home tuition',
    subcategories: ['Math', 'English', 'Science', 'Dhivehi', 'Islam', 'Computer basics'],
  },
  {
    category: 'Catering',
    filename: 'Cocktail%20bartender-bro.svg',
    blurb: 'Food & events',
    subcategories: ['Small party', 'Office lunch', 'Snacks', 'Desserts', 'Live cooking', 'BBQ'],
  },
  {
    category: 'Gardening',
    filename: 'Florist-amico.svg',
    blurb: 'Garden care',
    subcategories: ['Planting', 'Trimming', 'Lawn care', 'Pest care', 'Pot setup', 'Landscaping'],
  },
  {
    category: 'Other',
    filename: 'Work%20in%20progress-amico.svg',
    blurb: 'Any other services',
    subcategories: ['Custom request'],
  },
]

export const ALL_CATEGORIES: ServiceCategory[] = CATEGORY_CONFIG.map((c) => c.category)

export function getCategoryMeta(category: ServiceCategory) {
  return CATEGORY_CONFIG.find((c) => c.category === category)
}
