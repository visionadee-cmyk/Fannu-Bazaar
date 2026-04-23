import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'dv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  fontClass: string;
}

const translations = {
  en: {
    // App
    'app.title': 'Fannu Bazaar',
    'app.subtitle': 'Service marketplace',
    
    // Auth
    'auth.signIn': 'Sign in',
    'auth.signOut': 'Sign out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.phone': 'Phone',
    'auth.register': 'Register',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.loginHere': 'Login here',
    'auth.registerHere': 'Register here',
    'auth.role.customer': 'Customer',
    'auth.role.worker': 'Worker',
    'auth.role.admin': 'Admin',
    
    // Dashboard - Common
    'dashboard.welcome': 'Welcome',
    'dashboard.notifications': 'Notifications',
    'dashboard.alerts': 'Alerts',
    'dashboard.backToAdmin': 'Back to Admin',
    'dashboard.close': 'Close',
    
    // Customer Dashboard
    'customer.myRequests': 'My Requests',
    'customer.completed': 'Completed',
    'customer.createRequest': 'Create Request',
    'customer.noActiveRequests': 'No active requests',
    'customer.noCompletedRequests': 'No completed requests',
    'customer.browseCategories': 'Browse Categories',
    'category.select': 'Select Category',
    'category.search': 'Search categories...',
    'subcategory.select': 'Select Subcategory',
    
    // Request Form
    'request.title': 'Request Title',
    'request.description': 'Description',
    'request.location': 'Location',
    'request.budget': 'Budget (MVR)',
    'request.urgency': 'Urgency',
    'request.urgency.low': 'Low',
    'request.urgency.medium': 'Medium',
    'request.urgency.high': 'High',
    'request.inspectionRequired': 'Inspection Required',
    'request.contactName': 'Contact Person Name',
    'request.contactPhone': 'Contact Person Phone',
    'request.isRecurring': 'This is a recurring service',
    'request.recurringFrequency': 'Frequency',
    'request.recurringDiscount': 'Discount Request (%)',
    'request.recurring.hint': 'Workers may offer discounts for recurring jobs',
    'request.submit': 'Create Request',
    'request.cancel': 'Cancel',
    
    // Recurring frequencies
    'frequency.weekly': 'Weekly',
    'frequency.biweekly': 'Every 2 Weeks',
    'frequency.monthly': 'Monthly',
    'frequency.quarterly': 'Quarterly',
    'frequency.yearly': 'Yearly',
    
    // Worker Dashboard
    'worker.openRequests': 'Open Requests',
    'worker.myJobs': 'My Jobs',
    'worker.completedJobs': 'Completed Jobs',
    'worker.noOpenRequests': 'No open requests',
    'worker.noMyJobs': 'No active jobs',
    'worker.noCompletedJobs': 'No completed jobs',
    'worker.interested': 'Mark Interest',
    'worker.alreadyInterested': 'Already Interested',
    'worker.proposeInspection': 'Propose Inspection',
    'worker.scheduleWork': 'Schedule Work',
    'worker.submitQuote': 'Submit Quote',
    'worker.completeWork': 'Complete Work',
    'worker.markPaid': 'Mark as Paid',
    'worker.invoice': 'Invoice',
    
    // Job Statuses
    'status.open': 'Open',
    'status.pending': 'Pending',
    'status.inspectionPending': 'Inspection Pending',
    'status.inspectionScheduled': 'Inspection Scheduled',
    'status.awaitingQuote': 'Awaiting Quote',
    'status.quotePending': 'Quote Pending',
    'status.workScheduled': 'Work Scheduled',
    'status.workInProgress': 'Work In Progress',
    'status.paymentPending': 'Payment Pending',
    'status.completed': 'Completed',
    
    // Time & Dates
    'time.now': 'Now',
    'time.today': 'Today',
    'time.tomorrow': 'Tomorrow',
    'time.yesterday': 'Yesterday',
    'time.minutes': 'minutes',
    'time.hours': 'hours',
    'time.days': 'days',
    
    // Reminders
    'reminder.title': 'Reminder',
    'reminder.inspectionSoon': 'Inspection scheduled soon',
    'reminder.workSoon': 'Work scheduled soon',
    'reminder.30min': '30 minutes remaining',
    'reminder.15min': '15 minutes remaining',
    
    // Common Actions
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.sort': 'Sort',
    'action.save': 'Save',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.view': 'View',
    'action.accept': 'Accept',
    'action.reject': 'Reject',
    'action.confirm': 'Confirm',
    'action.cancel': 'Cancel',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.send': 'Send',
    'action.upload': 'Upload',
    'action.download': 'Download',
    'action.call': 'Call',
    'action.message': 'Message',
    'action.review': 'Review',
    'action.rate': 'Rate',
    'action.select': 'Select',
    'action.showMore': 'Show more',
    'action.showLess': 'Show less',
    
    // Common Labels
    'label.name': 'Name',
    'label.email': 'Email',
    'label.phone': 'Phone',
    'label.address': 'Address',
    'label.status': 'Status',
    'label.date': 'Date',
    'label.time': 'Time',
    'label.amount': 'Amount',
    'label.price': 'Price',
    'label.quantity': 'Quantity',
    'label.category': 'Category',
    'label.subcategory': 'Subcategory',
    'label.description': 'Description',
    'label.notes': 'Notes',
    'label.rating': 'Rating',
    'label.reviews': 'Reviews',
    'label.workers': 'Workers',
    'label.customers': 'Customers',
    'label.requests': 'Requests',
    'label.jobs': 'Jobs',
    'label.pending': 'Pending',
    'label.active': 'Active',
    'label.completed': 'Completed',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.version': 'Version',
    
    // Errors
    'error.generic': 'Something went wrong',
    'error.loading': 'Error loading data',
    'error.saving': 'Error saving data',
    'error.required': 'This field is required',
    'error.invalidEmail': 'Invalid email address',
    'error.invalidPhone': 'Invalid phone number',
  },
  dv: {
    // App
    'app.title': 'ފަންނު ބާޒާރު',
    'app.subtitle': 'ހިދުމަތް މާރުކޭޓް',
    
    // Auth
    'auth.signIn': 'ސައިން އިން',
    'auth.signOut': 'ސައިން އައުޓް',
    'auth.email': 'އީމެއިލް',
    'auth.password': 'ޕާސްވޯރޑް',
    'auth.name': 'ނަން',
    'auth.phone': 'ފޯނު',
    'auth.register': 'ރެޖިސްޓާ',
    'auth.alreadyHaveAccount': 'އައްކައުންޓެއް ހުރިތަ؟',
    'auth.dontHaveAccount': 'އައްކައުންޓެއް ނެތީ؟',
    'auth.loginHere': 'ލޮގިން ކުރާ',
    'auth.registerHere': 'ރެޖިސްޓާ ކުރާ',
    'auth.role.customer': 'ކަސްޓަމަރު',
    'auth.role.worker': 'މުވައްޒަފު',
    'auth.role.admin': 'އެޑްމިން',
    
    // Dashboard - Common
    'dashboard.welcome': 'މަރުޙަބާ',
    'dashboard.notifications': 'އިނގިލާތި',
    'dashboard.alerts': 'އިނގިލާތި',
    'dashboard.backToAdmin': 'އެޑްމިނަށް ދާ',
    'dashboard.close': 'ދެންމަރު',
    
    // Customer Dashboard
    'customer.myRequests': 'މަގަމް ރިކުއެސްޓުން',
    'customer.completed': 'ނިމިފަ',
    'customer.createRequest': 'ރިކުއެސްޓު ހަދާ',
    'customer.noActiveRequests': 'ހަރަކާތްތެރި ރިކުއެސްޓު ނެތް',
    'customer.noCompletedRequests': 'ނިމިފަ ރިކުއެސްޓު ނެތް',
    'customer.browseCategories': 'ކެޓަގަރީ ބަލާ',
    'category.select': 'ކެޓަގަރީ ހިޔާރުކުރާ',
    'category.search': 'ކެޓަގަރީ ހޯދާ...',
    'subcategory.select': 'ސަބްކެޓަގަރީ ހިޔާރުކުރާ',
    
    // Request Form
    'request.title': 'ރިކުއެސްޓުގެ ސުރުޚަ',
    'request.description': 'ތަފްސީލު',
    'request.location': 'ތަން',
    'request.budget': 'ބަޖެޓް (މެވިއާ)',
    'request.urgency': 'ދަތިކަން',
    'request.urgency.low': 'ދަށް',
    'request.urgency.medium': 'މެދު',
    'request.urgency.high': 'މަތި',
    'request.inspectionRequired': 'އިންސްޕެކްޝަން ބޭނުން',
    'request.contactName': 'ކޮންޓެކްޓް ޕަރުސަން ނަން',
    'request.contactPhone': 'ކޮންޓެކްޓް ފޯނު',
    'request.isRecurring': 'މި ހިދުމަތް މަޑުމަޑުން ބޭނުން',
    'request.recurringFrequency': 'މިންނުވާ ފަހަރު',
    'request.recurringDiscount': 'ޑިސްކައުންޓް ރިކުއެސްޓް (%)',
    'request.recurring.hint': 'މަޑުމަޑުން ހިދުމަތްތަކަށް މުވައްޒަފުން ޑިސްކައުންޓް ދޭން',
    'request.submit': 'ރިކުއެސްޓު ހަދާ',
    'request.cancel': 'ބާތިލް',
    
    // Recurring frequencies
    'frequency.weekly': 'ހަވީރު އެއްފަހަރު',
    'frequency.biweekly': 'ހަވީރު ދެފަހަރު',
    'frequency.monthly': 'މަހު އެއްފަހަރު',
    'frequency.quarterly': 'ތިން މަހުއްސެއްވާ',
    'frequency.yearly': 'އަހަރު އެއްފަހަރު',
    
    // Worker Dashboard
    'worker.openRequests': 'ހުޅުވިފަ ރިކުއެސްޓުން',
    'worker.myJobs': 'މަގަމް ޖޯބްސް',
    'worker.completedJobs': 'ނިމިފަ ޖޯބްސް',
    'worker.noOpenRequests': 'ހުޅުވިފަ ރިކުއެސްޓު ނެތް',
    'worker.noMyJobs': 'ހަރަކާތްތެރި ޖޯބް ނެތް',
    'worker.noCompletedJobs': 'ނިމިފަ ޖޯބް ނެތް',
    'worker.interested': 'އިންޓަރެސްޓު ދައްކާ',
    'worker.alreadyInterested': 'އިންޓަރެސްޓު ދައްކާފަ',
    'worker.proposeInspection': 'އިންސްޕެކްޝަން ޑޭޓް ހެދާ',
    'worker.scheduleWork': 'މަސް ޑޭޓް ހެދާ',
    'worker.submitQuote': 'ގޮތްވަކިވުން ފޮނުވާ',
    'worker.completeWork': 'މަސް ނިމި',
    'worker.markPaid': 'ފައިސާ ނަގާފަ',
    'worker.invoice': 'ބިލް',
    
    // Job Statuses
    'status.open': 'ހުޅުވިފަ',
    'status.pending': 'އިންތިޒާރު',
    'status.inspectionPending': 'އިންސްޕެކްޝަން އިންތިޒާރު',
    'status.inspectionScheduled': 'އިންސްޕެކްޝަން ޝެޑިއިއުލް ކުރެވިފަ',
    'status.awaitingQuote': 'ގޮތްވަކިވުމާ އިންތިޒާރު',
    'status.quotePending': 'ގޮތްވަކިވުން އިންތިޒާރު',
    'status.workScheduled': 'މަސް ޝެޑިއިއުލް ކުރެވިފަ',
    'status.workInProgress': 'މަސް ހަރަކާތްތެރި',
    'status.paymentPending': 'ފައިސާ އިންތިޒާރު',
    'status.completed': 'ނިމިފަ',
    
    // Time & Dates
    'time.now': 'މިހާރު',
    'time.today': 'މިއަދު',
    'time.tomorrow': 'މާދަމާ',
    'time.yesterday': 'އިއްޔެ',
    'time.minutes': 'މިނިޓު',
    'time.hours': 'ގަޑި',
    'time.days': 'ދުވަސް',
    
    // Reminders
    'reminder.title': 'އިނގިލާތި',
    'reminder.inspectionSoon': 'އިންސްޕެކްޝަން ގާތްވެއްޖެ',
    'reminder.workSoon': 'މަސް ގާތްވެއްޖެ',
    'reminder.30min': '30 މިނިޓު ދިމާވެއްޖެ',
    'reminder.15min': '15 މިނިޓު ދިމާވެއްޖެ',
    
    // Common Actions
    'action.search': 'ހޯދާ',
    'action.filter': 'ފިލްޓާ',
    'action.sort': 'ސޯރޓް',
    'action.save': 'ސޭވް',
    'action.edit': 'އެޑިޓް',
    'action.delete': 'ޑިލީޓް',
    'action.view': 'ބަލާ',
    'action.accept': 'ޤަބޫލު',
    'action.reject': 'ރިޖެކްޓް',
    'action.confirm': 'ކޮންފަރްމް',
    'action.cancel': 'ކެންސަލް',
    'action.back': 'ފަހަތައްދާ',
    'action.next': 'ކުރިޔަށް',
    'action.previous': 'ފަހަތަށް',
    'action.send': 'ފޮނުވާ',
    'action.upload': 'އަޕްލޯޑް',
    'action.download': 'ޑައުންލޯޑް',
    'action.call': 'ކޯލް',
    'action.message': 'މެސެޖު',
    'action.review': 'ރިވިއު',
    'action.rate': 'ރޭޓް',
    'action.select': 'ހިޔާރުކުރާ',
    'action.showMore': 'އިތް ބަލާ',
    'action.showLess': 'ކުޑަ ބަލާ',
    
    // Common Labels
    'label.name': 'ނަން',
    'label.email': 'އީމެއިލް',
    'label.phone': 'ފޯނު',
    'label.address': 'އެޑްރެސް',
    'label.status': 'ސްޓޭޓަސް',
    'label.date': 'ތާރީޚު',
    'label.time': 'ގަޑި',
    'label.amount': 'މިންނު',
    'label.price': 'ރޭޓް',
    'label.quantity': 'ޢަދަދު',
    'label.category': 'ކެޓަގަރީ',
    'label.subcategory': 'ސަބް ކެޓަގަރީ',
    'label.description': 'ތަފްސީލު',
    'label.notes': 'ނޯޓްސް',
    'label.rating': 'ރޭޓިންގް',
    'label.reviews': 'ރިވިއުސް',
    'label.workers': 'މުވައްޒަފުން',
    'label.customers': 'ކަސްޓަމަރުން',
    'label.requests': 'ރިކުއެސްޓުން',
    'label.jobs': 'މަސްތައް',
    'label.pending': 'ޕެންޑިން',
    'label.active': 'އެކްޓިވް',
    'label.completed': 'ކޮމްޕްލީޓަޑް',
    
    // Footer
    'footer.rights': 'ހުރިހާ ޙައްޤެއް ރައްކާކުރެވިފަ',
    'footer.version': 'ވަރޝަން',
    
    // Errors
    'error.generic': 'މައްސަބަތު ދިމާވިއެވެ',
    'error.loading': 'ޑޭޓާ ލޯޑް ކުރުމުގައި މައްސަބަތު',
    'error.saving': 'ޑޭޓާ ސޭވް ކުރުމުގައި މައްސަބަތު',
    'error.required': 'މިފީލްޑް ކޮންފަރްމް ކުރާ',
    'error.invalidEmail': 'ރަނގަޅު އީމެއިލް އެޑްރެސް ނޫން',
    'error.invalidPhone': 'ރަނގަޅު ފޯނު ނަންބަރެއް ނޫން',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const isRTL = language === 'dv';
  const fontClass = language === 'dv' ? 'dhivehi-font' : '';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, fontClass }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
