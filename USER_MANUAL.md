# Fannu Bazaar - User Manual

Complete guide for using the Fannu Bazaar service marketplace platform with 60+ work categories and advanced features.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Customer Guide](#customer-guide)
3. [Worker Guide](#worker-guide)
4. [Admin Guide](#admin-guide)
5. [Service Categories](#service-categories)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Platform

**Live URL**: https://fannu-bazaar.vercel.app/

### First Steps

1. **Visit the website** and explore the hero section to understand the platform
2. **Choose your role**: Customer, Worker, or Admin
3. **Log in** with your credentials or use demo accounts

### Demo Accounts

For testing purposes, you can use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `admin123` |
| Customer | `customer@demo.com` | `demo123` |
| Worker | `worker@demo.com` | `demo123` |

---

## Customer Guide

### Dashboard Overview

The Customer Dashboard provides everything you need to manage service requests:

- **My Requests**: View all your active service requests
- **New Request**: Create a new service request with advanced category selection
- **Needs Action**: Requests requiring your attention
- **Find Workers**: Browse and search for skilled workers across 60+ categories
- **Completed**: View your completed jobs and leave reviews

### Creating a Service Request

1. Click **"New Request"** tab
2. Fill in the service details:
   - **Title**: Brief description of what you need
   - **Category**: Select from 60+ service categories with visual cards
   - **Subcategory**: Choose specific service type (5-6 options per category)
   - **Description**: Detailed explanation of work needed
   - **Location**: Where the service is needed
   - **Budget**: Your expected budget in MVR
   - **Urgency**: Low, Medium, or High
   - **Inspection Required**: Toggle Yes/No (on mobile, form auto-scrolls to details after category selection)
   - **Contact Person**: (Optional) Name and phone of on-site contact person
   - **Recurring Service**: Toggle to schedule recurring jobs with frequency options
3. Click **"Create Request"**
4. Your request is now visible to workers in that category

### Finding Workers

1. Click **"Find Workers"** tab
2. **Filter by Category**: Use the dropdown to filter by service type
3. **Search**: Enter worker name, skills, or categories
4. **View Profile**: Click on any worker to see their full profile including:
   - Skills and expertise
   - Ratings and reviews
   - Jobs completed
   - Contact information

### Managing Your Requests

#### Request Statuses

- **Open**: Request is active and workers can view it
- **Pending Customer Confirmation**: Workers have shown interest, awaiting your selection
- **Inspection Pending**: Awaiting inspection proposal (if inspection required)
- **Inspection Scheduled**: An inspection has been arranged
- **Inspection Completed**: Inspection done, awaiting your confirmation
- **Awaiting Quote**: Worker selected, waiting for price quote
- **Quote Pending**: Waiting for price quote approval
- **Work Scheduled**: Work date has been set
- **Work Completed**: Work done, awaiting your confirmation
- **Payment Pending**: Work completed, awaiting payment
- **Completed**: Job finished, paid, and reviewed

#### Image Upload

When creating a service request, you can upload images to help workers understand the job:
1. Click **"Upload Images"** in the request form
2. Select one or more images (JPG, PNG)
3. Images are uploaded to Cloudinary and visible to workers

#### Inspection Toggle

You can toggle the inspection requirement anytime until inspection is completed:
1. Find your request in "My Requests" tab
2. Click **"Toggle Inspection"** button
3. If turned OFF: Request moves directly to quote phase if worker is selected
4. If turned ON: Worker must schedule and complete inspection first

### Contact Person Feature

When creating a service request, you can specify an on-site contact person:
- **Contact Name**: Person to meet at the service location
- **Contact Phone**: Phone number to reach the contact person

This information is visible to workers who accept your job, ensuring smooth coordination even if you won't be on-site.

### Recurring Services

For services you need regularly (cleaning, maintenance, etc.):
1. Check **"This is a recurring service"** when creating a request
2. Select frequency: **Weekly, Every 2 Weeks, Monthly, Quarterly,** or **Yearly**
3. Set discount request percentage (workers may offer discounts for recurring jobs)
4. A blue badge showing frequency and discount will appear on your request card

#### Actions You May Need to Take

1. **Confirm Worker**: Approve a worker who expressed interest
2. **Toggle Inspection**: Turn inspection requirement ON/OFF anytime
3. **Confirm Inspection**: Approve inspection date/time proposed by worker
4. **Confirm Inspection Completed**: Mark inspection as finished
5. **Approve Quote**: Accept the price quote submitted by worker
6. **Confirm Work Schedule**: Approve the proposed work schedule
7. **Confirm Work Completed**: Verify work is completed satisfactorily
8. **Upload Payment Slip**: Upload payment proof (image/PDF) after paying
9. **Mark Paid on Spot**: Alternative to slip upload for cash payments
10. **Leave Review**: Rate the worker 1-10 and provide feedback

#### Payment Process

After work is completed:
1. Worker generates invoice or you can proceed without invoice
2. **Upload Payment Slip** (recommended):
   - Take photo or screenshot of payment proof
   - Upload via the payment section
   - Workers can view and confirm receipt
3. **Or Mark "Paid on Spot"**:
   - Use if you paid cash directly to worker
   - Worker will confirm receipt
4. Worker confirms payment → Request moves to completed
5. You can now leave a review

### Reviewing Workers

After payment is confirmed:
1. Navigate to the completed job in "Completed" tab
2. Click **"Leave Review"** button
3. Rate the worker on 1-10 scale (10 = excellent)
4. Write your feedback (optional but recommended)
5. Submit the review

**Note**: Your review will be visible on the worker's profile along with their average rating and total review count.

---

## Worker Guide

### Dashboard Overview

The Worker Dashboard helps you manage your service business:

- **Browse**: Find new service requests with advanced filtering
- **Assigned**: View your assigned active jobs
- **Action Needed**: Jobs requiring your immediate attention
- **Completed**: View your finished jobs and earnings
- **Profile**: Manage your skills, categories, and information

### Finding Jobs

1. Click **"Browse"** tab
2. **Jobs List First**: On mobile, see available jobs immediately without scrolling past filters
3. **Filter by Category** (optional): Tap **Filters** to open category picker when needed
4. **Search**: Use the search bar to find specific job types
5. **Review Details**: Check budget, location, urgency, and inspection requirements

### Expressing Interest

When you find a suitable job:
1. Click **"I'm Interested"** to mark your interest
2. **Submit a quotation** (available after marking interest):
   - Enter your price in MVR
   - Add notes (e.g., "Includes materials")
   - Click **"Submit Quotation"**

The customer will be notified and can view your profile and quotation.

### Managing Assigned Jobs

Once a customer selects you, the job appears in **"My Jobs"**.

#### Job Workflow Steps

**If Inspection Required:**
1. **Inspection Phase**
   - Customer selects you → you receive notification to propose inspection
   - Propose inspection date/time
   - Customer accepts, rejects, or proposes alternate time
   - If rejected, you'll see a reason and can propose a new time
   - Complete the inspection and mark as done
   - Customer confirms inspection completion

2. **Quotation Phase**
   - Submit your price quote
   - Wait for customer approval

**If No Inspection Required:**
1. **Quotation Phase** (immediately after selection)
   - Customer selects you → you receive notification to submit quote
   - Submit your price quote
   - Wait for customer approval

**Work Phase** (after quote approval)
   - Schedule the work date/time
   - Customer accepts, rejects, or proposes alternate time
   - Complete the work and mark as done
   - Customer confirms work completion
   - Generate invoice with amount and description

**Payment Phase**
   - Track payment status
   - Mark as "Paid on Spot" or confirm payment receipt
   - Customer reviews and confirms payment

**In-App Reminders**
   - 30-minute reminder before inspection/work (orange alert)
   - 15-minute reminder (red urgent alert)
   - Tap to open the job details directly

### Building Your Profile

A strong profile helps you get more jobs:

1. Click **"Profile"** tab
2. **Update Information**:
   - **Skills**: List all your expertise areas
   - **Categories**: Select all service categories you offer (from 60+ options)
   - **About**: Write a professional bio highlighting your experience
   - **Contact**: Add phone, WhatsApp, and Viber numbers
   - **Photo**: Upload a professional profile picture
   - **Rates**: Set your hourly or project rates in MVR

3. **Build Your Reputation**:
   - Complete jobs on time and professionally
   - Provide high-quality workmanship
   - Earn good ratings (1-10 scale) and positive reviews
   - Respond quickly to new opportunities
   - Consider offering discounts for recurring service requests

#### Viewing Your Reviews

Your reviews are visible to customers when they view your profile:
- **Rating**: Average rating displayed (e.g., 8.5/10)
- **Review Count**: Total number of reviews received
- **Recent Reviews**: Last 10 reviews shown by default
- **Load More**: Click to see all historical reviews
- **Sorted by Date**: Newest reviews appear first

---

## Admin Guide

### Dashboard Overview

The Admin Dashboard provides complete platform oversight:

- **Overview**: Real-time statistics and platform health
- **Customers**: Manage customer accounts
- **Workers**: Manage worker accounts
- **Jobs**: Monitor all service requests
- **Settings**: Admin account settings

### Platform Statistics

The Overview tab displays:
- **Total Customers**: Number of registered customers (active/inactive)
- **Total Workers**: Number of registered workers (active/inactive)
- **Total Jobs**: All service requests (completed/pending)
- **Completion Rate**: Percentage of successfully completed jobs

### Managing Users

#### Customers

1. **Search**: Find customers by name, email, or phone
2. **Add Customer**: Click "Add Customer" button
3. **Edit**: Click the edit icon to modify customer details
4. **Activate/Deactivate**: Toggle status with the power button
5. **Delete**: Remove customer with trash icon

#### Workers

1. **Search**: Find workers by name, email, phone, or category
2. **Add Worker**: Click "Add Worker" button
3. **View Profile**: Click "View Profile" to see full worker details
4. **Edit**: Modify worker information
5. **Activate/Deactivate**: Control worker visibility
6. **Delete**: Remove worker from platform

### Monitoring Jobs

The Jobs section shows all service requests:

1. **Pending Tab**: Active jobs in progress
2. **Completed Tab**: Finished jobs
3. **Search**: Find jobs by title, category, customer, or worker
4. **Job Details**: View full job information including:
   - Customer details
   - Assigned worker
   - Interested workers count
   - Budget and timeline
   - Recurring service badge (if applicable)
   - Contact person information (if provided)

### Top Workers Panel

Displays highest-rated workers based on:
- Average rating score
- Number of completed jobs
- Customer reviews

### Admin Settings

#### Change Password

1. Go to **Settings** tab
2. Enter current password
3. Enter new password (minimum 4 characters)
4. Confirm new password
5. Click "Change Password"

#### Account Information

- **Admin Account**
- **Email**: `admin@demo.com`
- **Role**: Admin
- **Password**: `admin123`

The platform offers 60+ service categories organized into 8 main groups:

### Home Services (12 Categories)
**AC, Plumbing, Electrical, Carpentry, Cleaning, Painting, Appliance, Pest Control, Masonry, Welding, Moving, Gardening, plus specialized home services**

Each category includes 5-6 specific subcategories for precise service matching.

### Construction & Renovation (8 Categories)
**Civil Works, Roofing, Flooring, Waterproofing, Interior Design, Renovation, Scaffolding, Demolition, plus construction services**

### Technical & IT (8 Categories)
**IT Support, CCTV, Networking, Security Systems, Solar, Generator, Elevator, Fire Safety, plus technical services**

### Beauty & Personal Care (6 Categories)
**Beauty Services, Barber, Spa, Massage, Fitness, Yoga, plus personal care services**

### Events & Media (8 Categories)
**Photography, Videography, Event Planning, Catering, Bartending, DJ, Decoration, Entertainment, plus media services**

### Professional Services (6 Categories)
**Tutoring, Legal, Accounting, Consulting, Translation, Writing, plus professional services**

### Transportation & Logistics (6 Categories)
**Delivery, Driving, Logistics, Courier, Bike Repair, Auto Repair, plus transport services**

### Specialized Services (6 Categories)
**Laundry, Tailoring, Pet Care, Child Care, Elder Care, plus specialized services**

### Category Features

#### Visual Selection
- **Storyset Images**: Professional SVG illustrations for each category
- **Color Coding**: Visual distinction between category groups
- **Hover Effects**: Interactive cards with smooth animations
- **Responsive Grid**: Optimized layouts for all screen sizes

#### Smart Search
- **Real-time Filtering**: Instant results as you type
- **Category Matching**: Shows categories matching your search
- **Subcategory Search**: Find specific services within categories
- **Result Count**: See how many categories match your search

### Login Issues

**"Invalid email or password"**
- Verify email is entered correctly (check for typos)
- Confirm password is case-sensitive
- For admin: Use `admin@demo.com` with `admin123`
- Try clearing browser cache and cookies
- Ensure caps lock is off

**"Account not found"**
- The account may be inactive (contact admin)
- Use demo accounts to test the platform

### Dashboard Issues

**Page not loading**
- Refresh the browser
- Check your internet connection
- Clear localStorage and reload (will reset demo data)

**Data not updating**
- Changes are saved automatically
- Refresh the page to see latest updates
- Check if you're viewing the correct tab

### Job Workflow Issues

**Can't express interest**
- Job may already have a selected worker
- Check your worker profile is complete
- Ensure you're logged in as a worker

**Can't see my request**
- Check the correct tab ("My Requests")
- Request may be in a different status
- Try refreshing the dashboard

### Mobile UX

### Mobile-Optimized Interface

The platform is fully optimized for mobile devices:

#### Customer Mobile Features
- **Notification Bell**: Bell icon in header shows unread count with real-time updates
- **Hamburger Menu**: Access profile and sign out from top-right menu
- **Two-Step Request Form**: Select category → form auto-scrolls to details fields
- **Compact Tabs**: Grid layout for My Requests / New Request / Actions / Done / Workers
- **Modal New Request**: Full-screen popup for creating requests without scrolling

#### Worker Mobile Features
- **Notification Bell**: Bell icon with sound alerts for new notifications
- **Hamburger Menu**: Quick access to profile and sign out
- **Grid Tab Navigation**: Browse / My Jobs / Actions / Done / Profile in 2-column grid
- **Jobs First Browse**: See available jobs immediately; filters collapsed behind "Filters" button
- **Swipe-Friendly Cards**: Touch-optimized job cards with clear action buttons

### Notification System

All dashboards include a **Notification Bell** for real-time updates:

#### Notification Bell Features
- **Bell Icon**: Located in the dashboard header
- **Unread Badge**: Red badge shows count of unread notifications
- **Sound Effect**: Audio beep plays when new notifications arrive
- **Dropdown Panel**: Click bell to see all notifications
- **Mark as Read**: Individual or "Mark All Read" options

#### Notifications Sent For
- Worker shows interest in your job
- Customer selects you for a job
- Inspection scheduled/proposed
- Quote submitted or approved
- Work schedule confirmed
- Work completed and ready for payment
- Payment slip uploaded
- Payment confirmed

### Mobile vs Desktop Differences

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Bottom nav + hamburger menu | Top header with full menu |
| Browse Jobs | Jobs list first, filters optional | Filters always visible |
| Create Request | Full-screen modal popup | Inline card form |
| Tabs | 2-column grid | Horizontal scroll |
| Category Picker | Compact with search | Full grid with illustrations |

### Contact Support

For issues not covered here:
- **Email**: retey.ay@hotmail.com
- **GitHub**: https://github.com/rettey8810-byte/Fannu-Bazaar

---

## Tips for Success

### For Customers

1. **Be Specific**: Clear descriptions get better quotes
2. **Set Realistic Budgets**: Attract quality workers with fair pricing
3. **Respond Promptly**: Quick responses keep projects moving
4. **Leave Reviews**: Help other customers and reward good workers

### For Workers

1. **Complete Your Profile**: More information = more trust
2. **Respond Quickly**: Fast responses win jobs
3. **Be Professional**: Clear communication builds reputation
4. **Deliver Quality**: Good work leads to better ratings

---

## Tips for Success

### For Customers

1. **Be Specific**: Clear, detailed descriptions attract better quotes
2. **Set Realistic Budgets**: Fair pricing attracts quality workers
3. **Use Subcategories**: Select specific subcategories for accurate matching
4. **Respond Promptly**: Quick responses keep projects moving
5. **Leave Reviews**: Help other customers and reward good workers
6. **Use Search**: Take advantage of advanced search and filtering
7. **Check Profiles**: Review worker ratings and experience before selecting

### For Workers

1. **Complete Your Profile**: More information = more trust and jobs
2. **Select Relevant Categories**: Choose all service types you can perform
3. **Respond Quickly**: Fast responses win more opportunities
4. **Be Professional**: Clear communication builds your reputation
5. **Deliver Quality**: Good work leads to better ratings and reviews
6. **Use Photos**: Professional profile pictures increase trust
7. **Set Fair Prices**: Competitive rates attract more customers

### For Admins

1. **Monitor Regularly**: Check platform health and user activity
2. **Verify Workers**: Ensure worker profiles are complete and accurate
3. **Respond to Issues**: Address user problems quickly
4. **Track Metrics**: Use statistics to improve platform performance
5. **Maintain Quality**: Remove low-quality or fraudulent accounts
6. **Update Categories**: Keep service categories relevant and comprehensive

---

## Platform Features Summary

### ✅ Current Capabilities
- 60+ service categories with 300+ subcategories
- Advanced search and filtering system
- Complete job lifecycle management
- Real-time updates and notifications
- Responsive design for all devices
- Professional UI with Storyset illustrations
- Review and rating system
- Role-based access control
- Admin oversight tools

### 🔄 Real-time Updates
- Live dashboard synchronization
- Instant status changes
- Real-time search results
- Automatic UI updates

### 📱 Responsive Design
- Mobile-optimized layouts
- Tablet-friendly interfaces
- Desktop-enhanced features
- Touch-optimized controls
- Adaptive grid systems

---

*Last Updated: April 24, 2026*
*Platform Version: v2.2 - Notifications, Payment & Reviews*
