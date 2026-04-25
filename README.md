# Fannu Bazaar - Service Marketplace Platform

A comprehensive service marketplace platform connecting customers with skilled workers across 60+ service categories. Built with React 18, TypeScript, and Tailwind CSS with responsive design for all devices.

## ▶️ Run locally

### Prerequisites
- Node.js 18+ (recommended)
- npm (comes with Node.js)

### Steps
```bash
# 1) Clone
git clone <repository-url>

# 2) Go to project folder
cd maraamathu

# 3) Install dependencies
npm install

# 4) Start dev server
npm run dev
```

Then open the URL printed in the terminal (typically `http://localhost:5173`).

## 📚 Documentation

- `SETUP.md`
- `USER_MANUAL.md`
- `GIT_PUSH_GUIDE.md` (GitHub push + Vercel auto-deploy)

### Production build (optional)
```bash
# Build
npm run build

# Preview the production build locally
npm run preview
```

## 🚀 Features

### Customer Experience
- **Service Request Creation**: Create detailed service requests with budget, urgency, location, and subcategories
- **Advanced Category Selection**: Choose from 60+ work categories with 300+ subcategories
- **Smart Search**: Search categories, subcategories, and workers with intelligent filtering
- **Worker Discovery**: Browse and search for workers by service category with ratings and reviews
- **Full Workflow Management**: Track jobs through every stage from request to payment
- **Time Negotiation**: Accept or reject inspection/work schedule proposals with alternate time suggestions
- **Contact Person**: Specify on-site contact name and phone for service coordination
- **Recurring Services**: Schedule weekly, monthly, or custom recurring jobs with discount requests
- **Real-time Updates**: Instant UI updates as workers accept and progress through jobs

### Worker Experience
- **Job Management**: View and accept service requests matching their skills
- **Advanced Filtering**: Filter by category, subcategory, and search queries
- **Workflow Tools**: Schedule inspections, submit quotes, manage work schedules
- **Payment Tracking**: Mark payments as pending or paid
- **Profile Management**: Showcase skills, experience, ratings, and availability

### Complete Job Lifecycle
1. **Request** → Customer creates service request with category, subcategory, **inspection required flag**, **contact person**, and **recurring settings**
2. **Interest / Quotations** → Multiple workers can mark interest and submit quotations
3. **Select** → Customer selects a worker
4. **Inspection (optional)** → If inspection required: Worker proposes inspection time → Customer accepts/rejects with alternate time → Both confirm completion
5. **Quote** → Worker submits quote (after inspection or directly if inspection not required)
6. **Schedule** → Worker schedules work → Customer accepts/rejects with alternate time
7. **Work** → Worker completes job → Customer confirms completion → Worker generates invoice
8. **Payment** → Worker marks payment status (confirmed/paid on spot)
9. **Review** → Customer rates worker 1-10 and leaves feedback
10. **Complete** → Job marked as completed

### Service Categories (60+ Types)

#### Home Services (12 categories)
- **AC**: Installation, Gas refill, Not cooling, Cleaning/service, Compressor issue, General maintenance
- **Plumbing**: Leak fixing, Tap replacement, Toilet repair, Drain blockage, Water heater, Pipe fitting
- **Electrical**: Wiring, Switchboard, Lights, Fan repair, Socket issue, CCTV install
- **Carpentry**: Furniture repair, Door/lock adjustment, Shelves/cabinets, Curtain rods, Hinges, Custom work
- **Cleaning**: Deep cleaning, Regular cleaning, Sofa/mattress, Post-construction, Office cleaning, Move-in/out
- **Painting**: Interior painting, Exterior painting, Touch-up, Waterproofing, Ceiling, Wood polish
- **Appliance**: Washing machine, Fridge, Microwave, TV, Water dispenser, Small appliances
- **Pest Control**: Cockroaches, Bed bugs, Termites, Mosquito, Rodents, General spray
- **Masonry**: Tile fixing, Grouting, Plastering, Brick work, Concrete repair, Small renovations
- **Welding**: Gate welding, Railing, Steel fabrication, Repair welding, Stainless steel, Custom work
- **Moving**: House shifting, Office shifting, Pickup & drop, Packing help, Furniture moving, Heavy items
- **Gardening**: Planting, Trimming, Lawn care, Pest care, Pot setup, Landscaping

#### Construction & Renovation (8 categories)
- **Civil Works**: Foundation, Structural work, Columns/beams, Concrete work, Site preparation
- **Roofing**: Metal roofing, Tile roofing, Waterproofing, Gutter work, Leak repair
- **Flooring**: Tile flooring, Marble, Wooden flooring, Vinyl, Polishing
- **Waterproofing**: Terrace, Bathroom, Basement, Tank waterproofing, Leak sealing
- **Interior Design**: Space planning, Modular kitchen, Wardrobes, False ceiling, Wall decor
- **Renovation**: Full renovation, Partial remodeling, Kitchen upgrade, Bathroom redo, Office renovation
- **Scaffolding**: Erection, Dismantling, Rental, Inspection, Maintenance
- **Demolition**: Building demolition, Wall breaking, Concrete breaking, Debris removal, Site clearing

#### Technical & IT (8 categories)
- **IT**: Laptop/PC repair, Wi‑Fi setup, Printer setup, Software install, Data recovery, Phone setup
- **CCTV**: Installation, Repair, Upgrades, Monitoring setup, Maintenance
- **Networking**: LAN setup, WiFi extenders, Cabling, Router config, Network troubleshooting
- **Security Systems**: Alarm systems, Access control, Intercom, Smart locks, Sensors
- **Solar**: Panel installation, Inverter repair, Battery setup, Maintenance, Consultation
- **Generator**: Installation, Repair, Servicing, Rental, AMC
- **Elevator**: Installation, Repair, Maintenance, Modernization, Breakdown
- **Fire Safety**: Fire extinguishers, Alarm systems, Sprinkler install, Safety audit, Training

#### Beauty & Personal Care (6 categories)
- **Beauty**: Haircut, Hair color, Makeup, Henna, Facial, Bridal package
- **Barber**: Men haircut, Beard styling, Shave, Head massage, Kids haircut
- **Spa**: Body massage, Facial, Manicure, Pedicure, Aromatherapy
- **Massage**: Swedish, Deep tissue, Thai, Head massage, Foot reflexology
- **Fitness**: Personal trainer, Yoga instructor, Zumba, Crossfit, Diet planning
- **Yoga**: Hatha yoga, Power yoga, Meditation, Pranayama, Therapeutic yoga

#### Events & Media (8 categories)
- **Photography**: Event photography, Portraits, Product shoots, Video recording, Editing, Drone
- **Videography**: Wedding films, Corporate videos, Live streaming, Music videos, Reels editing
- **Event Planning**: Wedding planning, Corporate events, Birthday parties, Conferences, Exhibitions
- **Catering**: Small party, Office lunch, Snacks, Desserts, Live cooking, BBQ
- **Bartending**: Mocktails, Cocktails, Party bartender, Mobile bar, Flair bartending
- **DJ**: Wedding DJ, Party DJ, Sound system, Lighting, MC services
- **Decoration**: Flower decoration, Balloon decor, Stage setup, Lighting decor, Theme parties
- **Entertainment**: Magician, Musician, Dancer, Anchor, Game host, Kids entertainer

#### Professional Services (6 categories)
- **Tutoring**: Math, English, Science, Dhivehi, Islam, Computer basics
- **Legal**: Document drafting, Legal advice, Notary, Contract review, Consultation
- **Accounting**: Bookkeeping, Tax filing, Audit, Financial planning, Payroll
- **Consulting**: Business setup, Marketing, Operations, HR consulting, Strategy
- **Translation**: English-Dhivehi, Document translation, Interpretation, Subtitling, Proofreading
- **Writing**: Resume writing, Copywriting, Blog writing, Social media, Technical writing

#### Transportation & Logistics (6 categories)
- **Delivery**: Food delivery, Package delivery, Grocery delivery, Same-day, Bulk delivery
- **Driving**: Personal driver, Airport transfer, Outstation, Daily rental, School pickup
- **Logistics**: Warehouse, Inventory, Transport, Supply chain, Distribution
- **Courier**: Document courier, Parcel delivery, International, Bulk shipping, Express
- **Bike Repair**: Tune-up, Puncture, Brake repair, Gear fixing, Accessories install
- **Auto Repair**: Car service, Bike service, AC repair, Denting/painting, Battery

#### Specialized Services (6 categories)
- **Laundry**: Wash & fold, Dry cleaning, Ironing, Stain removal, Premium care
- **Tailoring**: Alterations, Stitching, Embroidery, Uniforms, Bridal wear
- **Pet Care**: Dog walking, Pet grooming, Pet sitting, Vet visits, Training
- **Child Care**: Babysitting, Nanny, Day care, Tutoring, Activity classes
- **Elder Care**: Nursing, Companion care, Physiotherapy, Medication help, Daily assistance
- **Other**: Custom requests for specialized services

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: React hooks and local state
- **Database**: LocalStorage-based mock database with real-time updates
- **Authentication**: Mock auth with role-based access (customer/worker/admin)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Images**: Storyset SVG illustrations (300+ images)
- **Responsive Design**: Mobile-first with desktop optimizations

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd maraamathu

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
.
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
├── .env.example
├── README.md
├── USER_MANUAL.md
└── src/
    ├── components/
    │   ├── Auth.tsx
    │   ├── AdminDashboard.tsx
    │   ├── BottomNav.tsx
    │   ├── CategoryPicker.tsx
    │   ├── CustomerDashboard.tsx
    │   ├── Illustration.tsx
    │   ├── InstallButton.tsx
    │   ├── ServiceRequestForm.tsx
    │   ├── WorkerDashboard.tsx
    │   ├── WorkerProfileForm.tsx
    │   └── WorkTypeCards.tsx
    ├── lib/
    │   ├── categoryConfig.ts
    │   ├── db.ts
    │   ├── hooks.ts
    │   └── types.ts
    └── App.tsx
```

## 🔐 Authentication

The app uses a mock authentication system with demo accounts:

### Customer Accounts
- **Email**: `customer@demo.com` → Select any customer profile
- **Role**: Customer

### Worker Accounts  
- **Email**: `worker@demo.com` → Select any worker profile
- **Role**: Worker

### Admin Account
- **Email**: `admin@demo.com`
- **Role**: Admin

## ✅ Completed Jobs tabs

- Customer Dashboard has a **Completed** tab.
- Worker Dashboard has a **Completed** tab.
- Completed jobs are separated from active jobs so the main lists stay clean.

## � Activate / Deactivate behavior

- Admin can toggle **Active / Inactive** for customers and workers.
- **Inactive users will not appear in the Sign in (demo) profile list**, and the app blocks key actions for deactivated users.

## �📊 Database Schema

### Core Entities
- **Users**: Customer profiles with contact information
- **Workers**: Service provider profiles with skills, rates, and ratings
- **Service Requests**: Job requests with workflow status tracking, categories, and subcategories
- **Service Categories**: 60+ service types with 300+ subcategories
- **Reviews**: Customer feedback and ratings for workers

### Workflow States
Each service request progresses through these states:
- With inspection: `open` → `pending_customer_confirmation` → `inspection_pending_worker_proposal` → `inspection_pending_customer_confirmation` → `inspection_scheduled` → `inspection_completed_pending_customer_confirm` → `awaiting_quote` → `quote_pending_approval` → `work_pending_worker_schedule` → `work_pending_customer_confirmation` → `work_scheduled` → `work_completed_pending_customer_confirm` → `payment_pending` → `completed`
- Without inspection: `open` → `pending_customer_confirmation` → `awaiting_quote` → `quote_pending_approval` → ...

## 🎨 UI Components & Features

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes with mobile-specific layouts
- **Desktop Enhancements**: Improved layouts for PC views with wider containers and better grid systems
- **Touch-Friendly**: Optimized interface elements for mobile devices
- **Adaptive Grids**: Dynamic column layouts (1-6 columns based on screen size)
- **Mobile Navigation**: Hamburger menu with notifications and quick actions
- **Mobile Forms**: Two-step category selection with auto-scroll to details
- **Mobile Browse**: Collapsible filters with jobs list prioritized

### Category Selection
- **Visual Cards**: Illustrated category cards with Storyset SVG images
- **Search Functionality**: Real-time search across categories and subcategories
- **Subcategory Support**: 300+ subcategories for precise service matching
- **Smart Filtering**: Category and subcategory filters with clear options

### Dashboard Features
- **Customer Dashboard**: My Requests, New Request, Needs Action, Find Workers, Completed tabs
- **Worker Dashboard**: Browse, Assigned, Completed, Action Needed, Profile tabs
- **Admin Dashboard**: Overview, Customers, Workers, Jobs, Settings tabs

## 🔄 Real-time Features

- **Live Updates**: UI automatically refreshes when data changes
- **Event Listeners**: Mock subscription system for real-time updates
- **State Synchronization**: All components stay in sync with database changes

## 🧪 Testing

The application includes comprehensive mock data seeding and can be tested with:
- Different user roles (customer/worker/admin)
- Complete workflow scenarios across all 60+ categories
- Edge cases and error handling
- Responsive design testing across devices
- Search and filter functionality

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layouts
- Touch-optimized buttons and inputs
- Bottom navigation for easy thumb access
- Compact category cards (2 columns)

### Tablet (768px - 1024px)
- Two to three column layouts
- Optimized spacing and touch targets
- Side navigation elements
- Medium category grids (3-4 columns)

### Desktop (> 1024px)
- Wide layouts with max-w-7xl containers
- Four to six column grids for categories
- Enhanced hover effects and micro-interactions
- Optimized spacing and visual hierarchy
- Clear filter layouts with dedicated sections

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Components
- **CategoryPicker**: Advanced category and subcategory selection with search
- **WorkTypeCards**: Responsive category grid with Storyset illustrations
- **Illustration**: Reusable image component with fallback handling
- **Dashboards**: Role-based interfaces with responsive layouts
- **TimeNegotiationUI**: Inspection and work schedule accept/reject with alternate time
- **InvoiceSystem**: Work completion invoice generation
- **PaymentConfirmation**: Paid on spot confirmation for workers

## 🚀 Deployment

The application is ready for deployment to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📈 Recent Enhancements

### v2.2 - Notifications, Payment & Reviews
- **Notification Bell**: Real-time bell icon with unread count in all dashboards
- **Notification Sound**: Audio alert when new notifications arrive
- **Payment Slip Upload**: Cloudinary-powered image/PDF upload for payment proof
- **Review System**: 1-10 rating with comments visible on worker profiles
- **Load More Reviews**: Last 10 reviews shown with "Load More" for history
- **Image Upload**: Customers upload job images when creating requests
- **Visual Timelines**: Progress tracking with tick marks for both customer and worker
- **Inspection Toggle**: Customers can toggle inspection requirement anytime

### v2.1 - Full Workflow & Recurring Services
- **Complete Job Workflow**: End-to-end process from request to payment with time negotiation
- **In-App Reminders**: 30/15 minute alerts for inspection and work schedules
- **Contact Person**: On-site contact details for service coordination
- **Recurring Services**: Weekly, monthly, and custom recurring job scheduling
- **Invoice Generation**: Automatic invoices after work completion
- **Payment Confirmation**: Worker confirms payment receipt
- **Rating System**: 1-10 scale worker ratings

### v2.0 - Service Category Expansion
- **60 Work Categories**: Expanded from 16 to 60+ service types
- **300+ Subcategories**: Detailed service classifications
- **Storyset Images**: Professional SVG illustrations for all categories
- **Smart Search**: Real-time filtering across categories and subcategories

### v1.5 - Responsive Design Improvements
- **Desktop Optimization**: Enhanced layouts for PC views
- **Grid Improvements**: 4-6 column layouts on desktop
- **Hover Effects**: Enhanced micro-interactions and visual feedback
- **Container Widths**: Increased to max-w-7xl for better space utilization

### v1.0 - Core Platform
- **Complete Workflow**: Full job lifecycle management
- **Role-Based Access**: Customer, Worker, and Admin interfaces
- **Real-time Updates**: Live UI synchronization
- **Review System**: Customer feedback and ratings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Email**: retey.ay@hotmail.com
- **GitHub**: https://github.com/rettey8810-byte/Fannu-Bazaar/issues
- **Live Demo**: https://fannu-bazaar.vercel.app/

---

Built with ❤️ for Fannu Bazaar service marketplace platform.
*Last Updated: April 24, 2026*
