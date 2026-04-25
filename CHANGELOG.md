# Changelog

All notable changes to the Fannu Bazaar project will be documented in this file.

## [2.2.0] - 2025-04-24

### Added
- **Notification Bell**: Bell icon with unread badge in all dashboard headers
- **Real-time Notifications**: Live notification dropdown with mark as read functionality
- **Notification Sound Effects**: Web Audio API beep when new notifications arrive
- **Payment Slip Upload**: Customers can upload payment proof (image/PDF) via Cloudinary
- **Payment Confirmation UI**: Workers see payment slip and confirm receipt
- **Review System**: 1-10 rating scale with comments, visible on worker profiles
- **Load More Reviews**: Worker profiles show last 10 reviews with "Load More" option
- **Inspection Toggle**: Customers can toggle inspection requirement until inspection completed
- **Image Upload**: Customers can upload job images when creating requests
- **Cloudinary Integration**: Image hosting for payment slips and job photos
- **Worker Timeline**: Visual timeline showing job progress for workers
- **Customer Timeline**: Visual timeline showing job status and actions needed
- **Request Detail Modal**: Full request details with worker selection and work schedule confirmation

### Changed
- **NotificationBell Component**: Added sound effects and real-time tracking
- **CustomerDashboard**: Added NotificationBell, payment UI, and review flow
- **WorkerDashboard**: Added NotificationBell, payment confirmation, and timeline
- **WorkerProfileModal**: Enhanced reviews section with load more functionality

### Fixed
- **Timeline Tick Alignment**: Fixed tick marks appearing above headings
- **Select Button State**: Now immediately shows "Selected" after worker selection
- **Missing Inspection UI**: Workers can now propose inspection dates/times
- **Quote Approval Notification**: Workers receive notification when customer accepts quote

## [2.1.0] - 2025-04-23

### Added
- **Full Workflow Implementation**: Complete end-to-end workflow with time negotiation and payment confirmation
- **Time Negotiation**: Inspection and work schedule negotiation with reject reason and alternate time proposals
- **Invoice Generation**: Generate invoices after work completion with amount and description
- **Payment Confirmation**: Worker confirms payment receipt with "Paid on Spot" option
- **In-App Reminders**: 30/15 minute reminders before inspection and work with color-coded urgency alerts
- **Contact Person Fields**: Optional contact name and phone for on-site coordination
- **Recurring Services**: Schedule recurring jobs with frequency (weekly, monthly, etc.) and discount requests
- **Rating System**: 1-10 scale rating for workers after job completion
- **Notification System**: Real-time notifications for all workflow events

### Changed
- **ServiceRequestForm**: Added contact person and recurring service sections
- **CustomerDashboard**: Added time negotiation UI, invoice/payment flows, and reminders banner
- **WorkerDashboard**: Added time negotiation UI, payment confirmation, and reminders banner

## [2.0.0] - 2025-03-05

### Added
- **Hero Section**: Added comprehensive hero section to landing page explaining platform functionality and benefits
- **Modern Dashboard Redesign**: Complete UI overhaul for Admin, Worker, and Customer dashboards
- **Overview Dashboard**: New statistics overview with real-time metrics for admins
- **Documentation**: Added comprehensive README, CHANGELOG, and User Manual
- **Top Workers Section**: Admin dashboard now displays top-rated workers
- **Recent Jobs Panel**: Quick access to recent service requests in admin view
- **Stat Cards**: Visual statistics cards showing key platform metrics

### Changed
- **UI Theme**: Migrated to mint green theme (#10B981) across all dashboards for consistency
- **Admin Dashboard**: Complete redesign with card-based layouts and improved navigation
- **Card Components**: Redesigned all cards with better shadows, rounded corners, and hover effects
- **Navigation**: Improved tab-based navigation with icons and active states
- **Settings Page**: Redesigned admin settings with better form layouts

### Fixed
- **Admin Login**: Fixed persistent "Invalid email or password" error with fallback account creation
- **Password Handling**: Corrected password validation for all user types
- **Build Errors**: Resolved all TypeScript compilation errors

## [1.5.0] - 2025-02-28

### Added
- **Google OAuth**: Implemented Google Sign-In via Supabase Auth
- **Role Picker**: Added role selection modal after OAuth authentication
- **Password Fields**: Added password support for customer and worker registration
- **Admin Account Creation**: Added `createAdmin` helper function for on-the-fly admin creation

### Changed
- **Auth Flow**: Improved authentication flow with password validation
- **Login UI**: Redesigned login page with modern card-based layout

### Removed
- **Facebook Login**: Removed Facebook OAuth due to regional access restrictions

## [1.4.0] - 2025-02-20

### Added
- **Completed Jobs Tabs**: Separate tabs for completed jobs in Customer and Worker dashboards
- **Activate/Deactivate**: Admin can now toggle user active status
- **Role Selection**: Improved role selection UI during signup
- **Find/Offer Skills**: Functional buttons for skill discovery in signup flow

### Fixed
- **Signup Flow**: Fixed non-functional "Find Skills / Offer Skills" buttons
- **Type Errors**: Resolved TypeScript type mismatches in dashboard components

## [1.3.0] - 2025-02-15

### Added
- **Worker Profile Modal**: Detailed worker profile view accessible from admin dashboard
- **Admin Settings**: Password change functionality for admin accounts
- **Database Seeding**: Automatic database seeding for demo accounts

### Changed
- **Theme Colors**: Updated to ASANA-style teal theme (#14b8a6)
- **Card Layouts**: Consistent card-based design across all dashboards

## [1.2.0] - 2025-02-10

### Added
- **Full Workflow**: Complete job lifecycle from request to payment
- **Inspection Flow**: Inspection scheduling and confirmation system
- **Quote System**: Worker quotation submission and customer approval
- **Payment Tracking**: Payment status management

### Fixed
- **Database Operations**: Fixed corrupted `createWorker` function
- **Request Filtering**: Corrected request status filtering logic

## [1.1.0] - 2025-02-05

### Added
- **Worker Categories**: Service category filtering for workers
- **Search Functionality**: Search workers and requests by various criteria
- **Rating System**: Worker rating and review system
- **Real-time Updates**: Live UI updates using event listeners

### Changed
- **UI Components**: Improved button and input styling
- **Responsive Design**: Better mobile responsiveness

## [1.0.0] - 2025-02-01

### Added
- **Initial Release**: First version of Fannu Bazaar platform
- **Three User Roles**: Customer, Worker, and Admin dashboards
- **Service Requests**: Customer can create service requests
- **Worker Discovery**: Browse workers by category
- **Mock Authentication**: Demo login system with seeded accounts
- **LocalStorage Database**: Client-side data persistence
- **Basic UI**: Initial dashboard layouts with Tailwind CSS

---

## Version Naming Convention

- **MAJOR**: Significant feature additions, architectural changes, or breaking changes
- **MINOR**: New features, improvements, or non-breaking changes
- **PATCH**: Bug fixes, documentation updates, or minor improvements
