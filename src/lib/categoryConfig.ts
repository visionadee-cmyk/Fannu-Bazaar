import type { ServiceCategory } from './types'

export type CategoryMeta = {
  category: ServiceCategory
  filename: string
  blurb: string
  subcategories: string[]
}

export const CATEGORY_CONFIG: CategoryMeta[] = [
  // Home Services (1-12)
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
    category: 'Gardening',
    filename: 'Florist-amico.svg',
    blurb: 'Garden care',
    subcategories: ['Planting', 'Trimming', 'Lawn care', 'Pest care', 'Pot setup', 'Landscaping'],
  },
  // Construction & Renovation (13-20)
  {
    category: 'CivilWorks',
    filename: 'Construction%20worker-bro.svg',
    blurb: 'Civil construction',
    subcategories: ['Foundation', 'Structural work', 'Columns/beams', 'Concrete work', 'Site preparation'],
  },
  {
    category: 'Roofing',
    filename: 'Construction%20worker-rafiki.svg',
    blurb: 'Roof installation',
    subcategories: ['Metal roofing', 'Tile roofing', 'Waterproofing', 'Gutter work', 'Leak repair'],
  },
  {
    category: 'Flooring',
    filename: 'Bricklayer-rafiki.svg',
    blurb: 'Floor installation',
    subcategories: ['Tile flooring', 'Marble', 'Wooden flooring', 'Vinyl', 'Polishing'],
  },
  {
    category: 'Waterproofing',
    filename: 'Construction%20worker-pana.svg',
    blurb: 'Waterproofing',
    subcategories: ['Terrace', 'Bathroom', 'Basement', 'Tank waterproofing', 'Leak sealing'],
  },
  {
    category: 'InteriorDesign',
    filename: 'Creative%20team-bro.svg',
    blurb: 'Interior design',
    subcategories: ['Space planning', 'Modular kitchen', 'Wardrobes', 'False ceiling', 'Wall decor'],
  },
  {
    category: 'Renovation',
    filename: 'Work%20in%20progress-amico.svg',
    blurb: 'Home renovation',
    subcategories: ['Full renovation', 'Partial remodeling', 'Kitchen upgrade', 'Bathroom redo', 'Office renovation'],
  },
  {
    category: 'Scaffolding',
    filename: 'Scaffold-amico.svg',
    blurb: 'Scaffold services',
    subcategories: ['Erection', 'Dismantling', 'Rental', 'Inspection', 'Maintenance'],
  },
  {
    category: 'Demolition',
    filename: 'Construction%20truck-pana.svg',
    blurb: 'Demolition work',
    subcategories: ['Building demolition', 'Wall breaking', 'Concrete breaking', 'Debris removal', 'Site clearing'],
  },
  // Technical & IT (21-28)
  {
    category: 'IT',
    filename: 'Processing-cuate.svg',
    blurb: 'Tech support',
    subcategories: ['Laptop/PC repair', 'Wi‑Fi setup', 'Printer setup', 'Software install', 'Data recovery', 'Phone setup'],
  },
  {
    category: 'CCTV',
    filename: 'Recording%20a%20movie-amico.svg',
    blurb: 'CCTV services',
    subcategories: ['Installation', 'Repair', 'Upgrades', 'Monitoring setup', 'Maintenance'],
  },
  {
    category: 'Networking',
    filename: 'World%20Youth%20Skills%20Day-amico.svg',
    blurb: 'Network setup',
    subcategories: ['LAN setup', 'WiFi extenders', 'Cabling', 'Router config', 'Network troubleshooting'],
  },
  {
    category: 'SecuritySystems',
    filename: 'Firefighter-cuate.svg',
    blurb: 'Security systems',
    subcategories: ['Alarm systems', 'Access control', 'Intercom', 'Smart locks', 'Sensors'],
  },
  {
    category: 'Solar',
    filename: 'Business%20growth-amico.svg',
    blurb: 'Solar solutions',
    subcategories: ['Panel installation', 'Inverter repair', 'Battery setup', 'Maintenance', 'Consultation'],
  },
  {
    category: 'Generator',
    filename: 'Construction%20costs-amico.svg',
    blurb: 'Generator services',
    subcategories: ['Installation', 'Repair', 'Servicing', 'Rental', 'AMC'],
  },
  {
    category: 'Elevator',
    filename: 'Logistics-cuate.svg',
    blurb: 'Elevator/lift',
    subcategories: ['Installation', 'Repair', 'Maintenance', 'Modernization', 'Breakdown'],
  },
  {
    category: 'FireSafety',
    filename: 'Firefighter-cuate.svg',
    blurb: 'Fire safety',
    subcategories: ['Fire extinguishers', 'Alarm systems', 'Sprinkler install', 'Safety audit', 'Training'],
  },
  // Beauty & Personal Care (29-34)
  {
    category: 'Beauty',
    filename: 'Hairdresser-cuate.svg',
    blurb: 'Salon at home',
    subcategories: ['Haircut', 'Hair color', 'Makeup', 'Henna', 'Facial', 'Bridal package'],
  },
  {
    category: 'Barber',
    filename: 'Hairdresser-cuate.svg',
    blurb: 'Barber services',
    subcategories: ['Men haircut', 'Beard styling', 'Shave', 'Head massage', 'Kids haircut'],
  },
  {
    category: 'Spa',
    filename: 'Soft%20skills-pana.svg',
    blurb: 'Spa & wellness',
    subcategories: ['Body massage', 'Facial', 'Manicure', 'Pedicure', 'Aromatherapy'],
  },
  {
    category: 'Massage',
    filename: 'Soft%20skills-bro.svg',
    blurb: 'Therapy massage',
    subcategories: ['Swedish', 'Deep tissue', 'Thai', 'Head massage', 'Foot reflexology'],
  },
  {
    category: 'Fitness',
    filename: 'Working%20from%20anywhere-rafiki.svg',
    blurb: 'Fitness training',
    subcategories: ['Personal trainer', 'Yoga instructor', 'Zumba', 'Crossfit', 'Diet planning'],
  },
  {
    category: 'Yoga',
    filename: 'Working%20from%20anywhere-rafiki.svg',
    blurb: 'Yoga classes',
    subcategories: ['Hatha yoga', 'Power yoga', 'Meditation', 'Pranayama', 'Therapeutic yoga'],
  },
  // Events & Media (35-42)
  {
    category: 'Photography',
    filename: 'Camera-amico.svg',
    blurb: 'Photo & video',
    subcategories: ['Event photography', 'Portraits', 'Product shoots', 'Video recording', 'Editing', 'Drone'],
  },
  {
    category: 'Videography',
    filename: 'Recording%20a%20movie-amico.svg',
    blurb: 'Video services',
    subcategories: ['Wedding films', 'Corporate videos', 'Live streaming', 'Music videos', 'Reels editing'],
  },
  {
    category: 'EventPlanning',
    filename: 'New%20team%20members-amico.svg',
    blurb: 'Event management',
    subcategories: ['Wedding planning', 'Corporate events', 'Birthday parties', 'Conferences', 'Exhibitions'],
  },
  {
    category: 'Catering',
    filename: 'Cocktail%20bartender-bro.svg',
    blurb: 'Food & events',
    subcategories: ['Small party', 'Office lunch', 'Snacks', 'Desserts', 'Live cooking', 'BBQ'],
  },
  {
    category: 'Bartending',
    filename: 'Cocktail%20bartender-bro.svg',
    blurb: 'Bartending',
    subcategories: ['Mocktails', 'Cocktails', 'Party bartender', 'Mobile bar', 'Flair bartending'],
  },
  {
    category: 'DJ',
    filename: 'Recording%20a%20movie-amico.svg',
    blurb: 'DJ services',
    subcategories: ['Wedding DJ', 'Party DJ', 'Sound system', 'Lighting', 'MC services'],
  },
  {
    category: 'Decoration',
    filename: 'Florist-amico.svg',
    blurb: 'Event decoration',
    subcategories: ['Flower decoration', 'Balloon decor', 'Stage setup', 'Lighting decor', 'Theme parties'],
  },
  {
    category: 'Entertainment',
    filename: 'Work%20in%20progress-pana.svg',
    blurb: 'Entertainment',
    subcategories: ['Magician', 'Musician', 'Dancer', 'Anchor', 'Game host', 'Kids entertainer'],
  },
  // Professional Services (43-48)
  {
    category: 'Tutoring',
    filename: 'World%20Youth%20Skills%20Day-amico.svg',
    blurb: 'Home tuition',
    subcategories: ['Math', 'English', 'Science', 'Dhivehi', 'Islam', 'Computer basics'],
  },
  {
    category: 'Legal',
    filename: 'Judge-bro.svg',
    blurb: 'Legal services',
    subcategories: ['Document drafting', 'Legal advice', 'Notary', 'Contract review', 'Consultation'],
  },
  {
    category: 'Accounting',
    filename: 'Business%20growth-rafiki.svg',
    blurb: 'Accounting',
    subcategories: ['Bookkeeping', 'Tax filing', 'Audit', 'Financial planning', 'Payroll'],
  },
  {
    category: 'Consulting',
    filename: 'Business%20growth-amico.svg',
    blurb: 'Business consulting',
    subcategories: ['Business setup', 'Marketing', 'Operations', 'HR consulting', 'Strategy'],
  },
  {
    category: 'Translation',
    filename: 'Soft%20skills-bro.svg',
    blurb: 'Translation',
    subcategories: ['English-Dhivehi', 'Document translation', 'Interpretation', 'Subtitling', 'Proofreading'],
  },
  {
    category: 'Writing',
    filename: 'Soft%20skills-pana.svg',
    blurb: 'Content writing',
    subcategories: ['Resume writing', 'Copywriting', 'Blog writing', 'Social media', 'Technical writing'],
  },
  // Transportation & Logistics (49-54)
  {
    category: 'Delivery',
    filename: 'Logistics-cuate.svg',
    blurb: 'Delivery services',
    subcategories: ['Food delivery', 'Package delivery', 'Grocery delivery', 'Same-day', 'Bulk delivery'],
  },
  {
    category: 'Driving',
    filename: 'Construction%20truck-pana.svg',
    blurb: 'Driver services',
    subcategories: ['Personal driver', 'Airport transfer', 'Outstation', 'Daily rental', 'School pickup'],
  },
  {
    category: 'Logistics',
    filename: 'Logistics-cuate.svg',
    blurb: 'Logistics',
    subcategories: ['Warehouse', 'Inventory', 'Transport', 'Supply chain', 'Distribution'],
  },
  {
    category: 'Courier',
    filename: 'Barcode-bro.svg',
    blurb: 'Courier services',
    subcategories: ['Document courier', 'Parcel delivery', 'International', 'Bulk shipping', 'Express'],
  },
  {
    category: 'BikeRepair',
    filename: 'Bicycle%20workshop-bro.svg',
    blurb: 'Bicycle repair',
    subcategories: ['Tune-up', 'Puncture', 'Brake repair', 'Gear fixing', 'Accessories install'],
  },
  {
    category: 'AutoRepair',
    filename: 'Bicycle%20workshop-rafiki.svg',
    blurb: 'Vehicle repair',
    subcategories: ['Car service', 'Bike service', 'AC repair', 'Denting/painting', 'Battery'],
  },
  // Other Specialized (55-60)
  {
    category: 'Laundry',
    filename: 'Laundry%20and%20dry%20cleaning-pana.svg',
    blurb: 'Laundry service',
    subcategories: ['Wash & fold', 'Dry cleaning', 'Ironing', 'Stain removal', 'Premium care'],
  },
  {
    category: 'Tailoring',
    filename: 'Measure-amico.svg',
    blurb: 'Stitching & tailoring',
    subcategories: ['Alterations', 'Stitching', 'Embroidery', 'Uniforms', 'Bridal wear'],
  },
  {
    category: 'PetCare',
    filename: 'Florist-amico.svg',
    blurb: 'Pet services',
    subcategories: ['Dog walking', 'Pet grooming', 'Pet sitting', 'Vet visits', 'Training'],
  },
  {
    category: 'ChildCare',
    filename: 'New%20team%20members-amico.svg',
    blurb: 'Child care',
    subcategories: ['Babysitting', 'Nanny', 'Day care', 'Tutoring', 'Activity classes'],
  },
  {
    category: 'ElderCare',
    filename: 'Soft%20skills-pana.svg',
    blurb: 'Elderly care',
    subcategories: ['Nursing', 'Companion care', 'Physiotherapy', 'Medication help', 'Daily assistance'],
  },
  {
    category: 'Other',
    filename: 'Work%20in%20progress-pana.svg',
    blurb: 'Any other services',
    subcategories: ['Custom request'],
  },
  // Food & Retail (61-67)
  {
    category: 'Baking',
    filename: 'Creative%20team-bro.svg',
    blurb: 'Cakes & baked goods',
    subcategories: ['Birthday cakes', 'Wedding cakes', 'Custom cupcakes', 'Cookies', 'Pastries', 'Savory bakes'],
  },
  {
    category: 'FoodStall',
    filename: 'Cocktail%20bartender-bro.svg',
    blurb: 'Local snacks & bites',
    subcategories: ['Local snacks', 'Short eats', 'Bajiya', 'Keemia', 'Fresh juices', 'Tea/coffee'],
  },
  {
    category: 'FreshProduce',
    filename: 'Florist-amico.svg',
    blurb: 'Fresh fish & local produce',
    subcategories: ['Fresh fish', 'Dried fish', 'Local vegetables', 'Homemade pickles', 'Local fruits', 'Coconut products'],
  },
  // Vehicle Services (68)
  {
    category: 'VehicleCleaning',
    filename: 'Bicycle%20workshop-rafiki.svg',
    blurb: 'Bike & car cleaning',
    subcategories: ['Bike washing', 'Car washing', 'Interior detailing', 'Engine cleaning', 'Seat shampooing', 'Waterless wash'],
  },
  // Creative & Rental (69-71)
  {
    category: 'Crafts',
    filename: 'Creative%20team-bro.svg',
    blurb: 'Handicrafts & school projects',
    subcategories: ['School projects', 'Gift items', 'Home decor', 'Custom orders', 'Bead work', 'Paper crafts'],
  },
  {
    category: 'Rentals',
    filename: 'Logistics-cuate.svg',
    blurb: 'Bike & equipment rental',
    subcategories: ['Bike rental daily', 'Car rental daily', 'Event equipment', 'Tools', 'Camera gear', 'Costumes'],
  },
  {
    category: 'RealEstate',
    filename: 'Business%20growth-amico.svg',
    blurb: 'House & rental assistance',
    subcategories: ['Rental help', 'Property search', 'Tenant finding', 'Document help', 'Inspection visit'],
  },
]

export const ALL_CATEGORIES: ServiceCategory[] = CATEGORY_CONFIG.map((c) => c.category)

export function getCategoryMeta(category: ServiceCategory) {
  return CATEGORY_CONFIG.find((c) => c.category === category)
}

// Category-specific form field types
export type FormFieldType = 'text' | 'number' | 'date' | 'time' | 'select' | 'multiselect' | 'textarea' | 'checkbox'

export type FormField = {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  helperText?: string
}

export type CategoryFormConfig = {
  category: ServiceCategory
  fields: FormField[]
}

// Category-specific form configurations
export const CATEGORY_FORM_CONFIG: CategoryFormConfig[] = [
  // Food & Retail
  {
    category: 'Baking',
    fields: [
      { name: 'flavor', label: 'Flavor/Type', type: 'select', options: ['Vanilla', 'Chocolate', 'Strawberry', 'Red Velvet', 'Lemon', 'Custom'], required: true },
      { name: 'size', label: 'Size/Servings', type: 'select', options: ['Small (4-6)', 'Medium (8-12)', 'Large (15-20)', 'Extra Large (25+)'], required: true },
      { name: 'deliveryDate', label: 'Required Date', type: 'date', required: true },
      { name: 'deliveryTime', label: 'Preferred Time', type: 'time' },
      { name: 'dietary', label: 'Dietary Requirements', type: 'multiselect', options: ['Eggless', 'Sugar-free', 'Gluten-free', 'Vegan', 'Nut-free'], helperText: 'Select any dietary restrictions' },
      { name: 'message', label: 'Message on Cake', type: 'text', placeholder: 'Happy Birthday John' },
      { name: 'occasion', label: 'Occasion', type: 'select', options: ['Birthday', 'Wedding', 'Anniversary', 'Graduation', 'Corporate', 'Other'] },
    ],
  },
  {
    category: 'FoodStall',
    fields: [
      { name: 'itemType', label: 'Item Type', type: 'select', options: ['Savory snacks', 'Sweet snacks', 'Beverages', 'Combo meals'], required: true },
      { name: 'quantity', label: 'Quantity/People', type: 'number', min: 1, required: true, helperText: 'Number of people or items needed' },
      { name: 'deliveryDate', label: 'Required Date', type: 'date', required: true },
      { name: 'deliveryTime', label: 'Required Time', type: 'time', required: true },
      { name: 'spiceLevel', label: 'Spice Level', type: 'select', options: ['Mild', 'Medium', 'Spicy', 'Very Spicy'] },
    ],
  },
  {
    category: 'FreshProduce',
    fields: [
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Fresh fish', 'Dried fish', 'Vegetables', 'Fruits', 'Pickles', 'Coconut products'], required: true },
      { name: 'quantity', label: 'Quantity (kg/pieces)', type: 'number', min: 0.5, step: 0.5, required: true },
      { name: 'deliveryPreference', label: 'Delivery Preference', type: 'select', options: ['Same day', 'Next day', 'Within 3 days', 'Pick up myself'], required: true },
      { name: 'deliveryDate', label: 'Required Date', type: 'date' },
      { name: 'freshness', label: 'Freshness Preference', type: 'select', options: ['Fresh catch of the day', 'Within 24 hours', 'Frozen is OK'] },
    ],
  },
  // Vehicle Services
  {
    category: 'VehicleCleaning',
    fields: [
      { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Bike', 'Car', 'Van', 'SUV', 'Pickup truck'], required: true },
      { name: 'serviceType', label: 'Service Package', type: 'select', options: ['Exterior wash only', 'Interior cleaning', 'Full detailing', 'Engine cleaning', 'Seat shampooing'], required: true },
      { name: 'vehicleCount', label: 'Number of Vehicles', type: 'number', min: 1, max: 10, required: true },
      { name: 'preferredDate', label: 'Preferred Date', type: 'date' },
      { name: 'preferredTime', label: 'Preferred Time', type: 'time' },
      { name: 'locationType', label: 'Service Location', type: 'select', options: ['My location (home)', 'Worker location', 'Office/workplace'], required: true },
    ],
  },
  // Education
  {
    category: 'Tutoring',
    fields: [
      { name: 'subject', label: 'Subject', type: 'select', options: ['Math', 'English', 'Science', 'Dhivehi', 'Islam', 'Computer', 'Business', 'Accounting'], required: true },
      { name: 'gradeLevel', label: 'Grade/Level', type: 'select', options: ['Preschool', 'Grade 1-3', 'Grade 4-6', 'Grade 7-9', 'Grade 10', 'O Level', 'A Level', 'University'], required: true },
      { name: 'studentCount', label: 'Number of Students', type: 'number', min: 1, max: 20, required: true, helperText: 'For batch tuition' },
      { name: 'daysPerWeek', label: 'Days per Week', type: 'select', options: ['1 day', '2 days', '3 days', '4 days', '5 days', 'Weekends only'], required: true },
      { name: 'sessionDuration', label: 'Session Duration', type: 'select', options: ['1 hour', '1.5 hours', '2 hours', '3 hours'], required: true },
      { name: 'preferredDays', label: 'Preferred Days', type: 'multiselect', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      { name: 'preferredTime', label: 'Preferred Time', type: 'select', options: ['Morning (8-12)', 'Afternoon (12-4)', 'Evening (4-8)', 'Night (after 8)'] },
      { name: 'studentGender', label: 'Student Gender', type: 'select', options: ['Male only', 'Female only', 'Mixed batch'], helperText: 'For batch tuition preferences' },
    ],
  },
  // Creative & Rental
  {
    category: 'Crafts',
    fields: [
      { name: 'projectType', label: 'Project Type', type: 'select', options: ['School project', 'Gift item', 'Home decor', 'Event decoration', 'Custom order'], required: true },
      { name: 'craftType', label: 'Craft/Material Type', type: 'select', options: ['Paper craft', 'Bead work', 'Fabric', 'Wood', 'Recycled materials', 'Mixed media'], required: true },
      { name: 'deadline', label: 'Deadline Date', type: 'date', required: true },
      { name: 'quantity', label: 'Quantity Needed', type: 'number', min: 1, required: true },
      { name: 'materialsProvided', label: 'Materials Provided by You?', type: 'checkbox', helperText: 'Check if you will provide materials' },
      { name: 'budgetPerItem', label: 'Budget Per Item (MVR)', type: 'number', min: 10 },
    ],
  },
  {
    category: 'Rentals',
    fields: [
      { name: 'rentalType', label: 'Rental Type', type: 'select', options: ['Bike', 'Car', 'Event equipment', 'Tools', 'Camera gear', 'Costumes/attire'], required: true },
      { name: 'startDate', label: 'Rental Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Rental End Date', type: 'date', required: true },
      { name: 'pickupTime', label: 'Pickup Time', type: 'time' },
      { name: 'returnTime', label: 'Return Time', type: 'time' },
      { name: 'quantity', label: 'Quantity', type: 'number', min: 1, required: true },
      { name: 'purpose', label: 'Purpose', type: 'text', placeholder: 'e.g., Wedding photoshoot, DIY project' },
      { name: 'licenseProvided', label: 'Valid License Available?', type: 'checkbox', helperText: 'For vehicle rentals' },
    ],
  },
  {
    category: 'RealEstate',
    fields: [
      { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Looking to rent', 'Looking for tenant', 'Property search', 'Document assistance'], required: true },
      { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Apartment', 'House', 'Room', 'Office space', 'Shop', 'Warehouse'], required: true },
      { name: 'bedrooms', label: 'Bedrooms Needed', type: 'select', options: ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4+ bedrooms'] },
      { name: 'budgetMin', label: 'Min Budget (MVR/month)', type: 'number', min: 0 },
      { name: 'budgetMax', label: 'Max Budget (MVR/month)', type: 'number', min: 0, required: true },
      { name: 'preferredLocation', label: 'Preferred Area/Location', type: 'text', placeholder: 'e.g., Male, Hulhumale, Addu' },
      { name: 'moveInDate', label: 'Move-in Date', type: 'date' },
      { name: 'duration', label: 'Rental Duration', type: 'select', options: ['Short term (1-3 months)', 'Medium term (3-6 months)', 'Long term (6+ months)', 'Permanent'] },
      { name: 'furnished', label: 'Furnished?', type: 'select', options: ['Furnished', 'Unfurnished', 'Semi-furnished', 'Any'] },
    ],
  },
  // Default/generic for categories without specific config
]

export function getCategoryFormConfig(category: ServiceCategory): FormField[] {
  const config = CATEGORY_FORM_CONFIG.find((c) => c.category === category)
  return config?.fields ?? []
}

export function hasCategorySpecificFields(category: ServiceCategory): boolean {
  return CATEGORY_FORM_CONFIG.some((c) => c.category === category)
}
