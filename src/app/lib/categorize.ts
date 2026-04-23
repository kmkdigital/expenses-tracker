export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  subcategory: string
  rawRow: Record<string, string>
}

export interface CategoryRule {
  category: string
  subcategory: string
  keywords: string[]
}

export const CATEGORY_RULES: CategoryRule[] = [
  // INCOME
  { category: 'Income', subcategory: 'Salary', keywords: ['salary', 'payroll', 'wages', 'direct deposit', 'employment'] },
  { category: 'Income', subcategory: 'Freelance', keywords: ['freelance', 'consulting', 'invoice', 'contract', 'upwork', 'fiverr'] },
  { category: 'Income', subcategory: 'Transfer In', keywords: ['transfer in', 'deposit', 'receive', 'refund', 'cashback', 'reimbursement'] },
  { category: 'Income', subcategory: 'Investment', keywords: ['dividend', 'interest', 'investment return', 'capital gain', 'etf', 'stock'] },

  // FOOD & DINING — no Groceries subcat (handled by top-level Groceries category)
  { category: 'Food & Dining', subcategory: 'Restaurants', keywords: ['restaurant', 'cafe', 'bistro', 'diner', 'grill', 'kitchen', 'eatery', 'bbq', 'sushi', 'pizza', 'burger', 'mcdonald', 'kfc', 'subway', 'wendy', 'taco bell', 'chipotle', 'starbucks', 'dunkin'] },
  { category: 'Food & Dining', subcategory: 'Food Delivery', keywords: ['doordash', 'ubereats', 'grubhub', 'instacart', 'postmates', 'delivery', 'seamless', 'door dash'] },
  { category: 'Food & Dining', subcategory: 'Coffee & Drinks', keywords: ['coffee', 'espresso', 'latte', 'tea', 'smoothie', 'juice bar', 'boba'] },

  // HOUSING
  { category: 'Housing', subcategory: 'Rent / Mortgage', keywords: ['rent', 'mortgage', 'lease', 'housing', 'landlord', 'property management'] },
  { category: 'Housing', subcategory: 'Repairs & Maintenance', keywords: ['repair', 'maintenance', 'plumber', 'electrician', 'handyman', 'home depot', 'lowes', 'hardware store', 'fix', 'renovation'] },

  // UTILITIES
  { category: 'Utilities', subcategory: 'Electricity & Gas', keywords: ['electric', 'electricity', 'gas bill', 'water bill', 'utility', 'utilities', 'power', 'energy', 'sewage'] },
  { category: 'Utilities', subcategory: 'Internet & Phone', keywords: ['internet', 'broadband', 'wifi', 'at&t', 'verizon', 'comcast', 'xfinity', 't-mobile', 'sprint', 'phone bill', 'mobile plan', 'telecom'] },

  // TRANSPORT
  { category: 'Transport', subcategory: 'Fuel', keywords: ['fuel', 'gas station', 'petrol', 'shell', 'exxon', 'chevron', 'mobil', 'sunoco', 'texaco', 'circle k', 'speedway'] },
  { category: 'Transport', subcategory: 'Ride Share', keywords: ['uber', 'lyft', 'taxi', 'cab', 'ride share', 'rideshare', 'bolt', 'grab'] },
  { category: 'Transport', subcategory: 'Public Transit', keywords: ['metro', 'bus pass', 'transit', 'mta', 'train ticket', 'rail', 'oyster', 'commute'] },
  { category: 'Transport', subcategory: 'Car Insurance', keywords: ['car insurance', 'auto insurance', 'vehicle insurance', 'geico', 'allstate', 'progressive', 'state farm'] },
  { category: 'Transport', subcategory: 'Parking & Tolls', keywords: ['parking', 'toll', 'e-zpass', 'meter'] },
  { category: 'Transport', subcategory: 'Car Payment', keywords: ['car payment', 'auto loan', 'vehicle payment', 'car finance', 'auto finance'] },

  // HEALTH
  { category: 'Health', subcategory: 'Medical', keywords: ['hospital', 'clinic', 'doctor', 'physician', 'medical', 'urgent care', 'er visit', 'surgery', 'specialist'] },
  { category: 'Health', subcategory: 'Pharmacy', keywords: ['pharmacy', 'cvs', 'walgreens', 'rite aid', 'prescription', 'medication', 'drug store'] },
  { category: 'Health', subcategory: 'Dental & Vision', keywords: ['dental', 'dentist', 'orthodontist', 'vision', 'optometrist', 'glasses', 'contacts', 'eye care'] },
  { category: 'Health', subcategory: 'Gym & Fitness', keywords: ['gym', 'fitness', 'crossfit', 'yoga', 'pilates', 'planet fitness', '24 hour fitness', 'equinox', 'workout', 'peloton'] },

  // ENTERTAINMENT
  { category: 'Entertainment', subcategory: 'Streaming', keywords: ['netflix', 'hulu', 'disney+', 'hbo', 'apple tv', 'spotify', 'youtube premium', 'paramount', 'peacock', 'streaming'] },
  { category: 'Entertainment', subcategory: 'Gaming', keywords: ['steam', 'playstation', 'xbox', 'nintendo', 'gaming', 'twitch', 'epic games'] },
  { category: 'Entertainment', subcategory: 'Movies & Events', keywords: ['cinema', 'movie', 'theater', 'concert', 'event', 'ticket', 'ticketmaster', 'live nation', 'amc'] },
  { category: 'Entertainment', subcategory: 'Bars & Nightlife', keywords: ['bar', 'pub', 'nightclub', 'lounge', 'brewery', 'winery', 'liquor', 'alcohol'] },

  // SHOPPING
  { category: 'Shopping', subcategory: 'Clothing', keywords: ['clothing', 'clothes', 'apparel', 'fashion', 'h&m', 'zara', 'gap', 'nike', 'adidas', 'shein', 'nordstrom', 'macy', 'uniqlo', 'dress', 'shoes', 'boots'] },
  { category: 'Shopping', subcategory: 'Electronics', keywords: ['apple', 'best buy', 'amazon', 'electronics', 'laptop', 'tablet', 'gadget', 'tech', 'newegg'] },
  { category: 'Shopping', subcategory: 'Home & Garden', keywords: ['ikea', 'target', 'bed bath', 'home goods', 'furniture', 'garden', 'decor', 'home & garden'] },
  { category: 'Shopping', subcategory: 'Online Shopping', keywords: ['ebay', 'etsy', 'wish', 'aliexpress', 'online order', 'shopify'] },

  // EDUCATION
  { category: 'Education', subcategory: 'Tuition', keywords: ['tuition', 'university', 'college', 'school fee', 'enrollment', 'student loan'] },
  { category: 'Education', subcategory: 'Online Courses', keywords: ['udemy', 'coursera', 'skillshare', 'pluralsight', 'linkedin learning', 'masterclass', 'online course'] },
  { category: 'Education', subcategory: 'Books & Supplies', keywords: ['amazon books', 'textbook', 'stationery', 'school supply', 'supplies'] },

  // TRAVEL
  { category: 'Travel', subcategory: 'Flights', keywords: ['flight', 'airline', 'united airlines', 'delta', 'american airlines', 'southwest', 'spirit', 'jetblue', 'air', 'airways'] },
  { category: 'Travel', subcategory: 'Hotels', keywords: ['hotel', 'airbnb', 'motel', 'resort', 'hostel', 'marriott', 'hilton', 'hyatt', 'booking.com', 'expedia'] },
  { category: 'Travel', subcategory: 'Vacation', keywords: ['vacation', 'holiday', 'trip', 'travel', 'tour', 'cruise', 'excursion'] },

  // FINANCE
  { category: 'Finance', subcategory: 'Bank Fees', keywords: ['bank fee', 'service charge', 'atm fee', 'overdraft', 'monthly fee', 'maintenance fee'] },
  { category: 'Finance', subcategory: 'Insurance', keywords: ['insurance premium', 'life insurance', 'health insurance', 'renters insurance', 'home insurance'] },
  { category: 'Finance', subcategory: 'Savings Transfer', keywords: ['savings transfer', 'transfer out', 'savings account', 'investment transfer'] },
  { category: 'Finance', subcategory: 'Loan Payment', keywords: ['loan payment', 'personal loan', 'credit card payment', 'debt payment'] },

  // SUBSCRIPTIONS
  { category: 'Subscriptions', subcategory: 'Software & Apps', keywords: ['adobe', 'microsoft 365', 'dropbox', 'google one', 'icloud', 'notion', 'slack', 'zoom', 'subscription', 'saas', 'software'] },
  { category: 'Subscriptions', subcategory: 'News & Media', keywords: ['new york times', 'washington post', 'wsj', 'medium', 'substack', 'magazine', 'newspaper'] },
  { category: 'Subscriptions', subcategory: 'Memberships', keywords: ['membership', "sam's club", 'aaa', 'club membership'] },
]

export const CATEGORY_COLORS: Record<string, string> = {
  'Income': '#22c55e',
  'Groceries': '#84cc16',
  'Food & Dining': '#f97316',
  'Housing': '#3b82f6',
  'Utilities': '#0ea5e9',
  'Transport': '#8b5cf6',
  'Health': '#ec4899',
  'Entertainment': '#eab308',
  'Shopping': '#06b6d4',
  'Education': '#14b8a6',
  'Travel': '#f43f5e',
  'Finance': '#64748b',
  'Subscriptions': '#a855f7',
  'Overseas Transfer': '#fb923c',
  'KMK Digital Expenses': '#e879f9',
  'Other': '#94a3b8',
}

export function categorizeTransaction(description: string, amount: number): { category: string; subcategory: string; type: 'income' | 'expense' } {
  const raw = description
  const desc = description.toLowerCase()

  // ── INCOME ────────────────────────────────────────────────────────────
  // Airtasker: "Direct Credit XXXXXX ATXXXXXXXX"
  if (/direct credit/i.test(raw) && /\bAT\d+/i.test(raw)) {
    return { category: 'Income', subcategory: 'Airtasker', type: 'income' }
  }

  // ── FUEL ──────────────────────────────────────────────────────────────
  if (/7-eleven|7eleven|7 eleven/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Fuel', type: 'expense' }
  }
  if (/\bAMPOL\b/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Fuel', type: 'expense' }
  }
  if (/\bBP\b/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Fuel', type: 'expense' }
  }
  if (/coles express/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Fuel', type: 'expense' }
  }
  if (/\bLIBERTY\b/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Fuel', type: 'expense' }
  }

  // ── TRANSPORT ─────────────────────────────────────────────────────────
  if (/translink/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Public Transit', type: 'expense' }
  }
  if (/nundah station/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Public Transit', type: 'expense' }
  }
  if (/transportmainrds|norris motor group/i.test(raw)) {
    return { category: 'Transport', subcategory: 'Rego & Car Service', type: 'expense' }
  }

  // ── GROCERIES ─────────────────────────────────────────────────────────
  if (/woolworths/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  // Match COLES but NOT Coles Express (already caught above as Fuel)
  if (/\bcoles\b/i.test(raw) && !/coles express/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  if (/spices galore/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  if (/costco wholesale/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  if (/nandi bazaar/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  if (/swades foods/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }
  if (/cabbage patch/i.test(raw)) {
    return { category: 'Groceries', subcategory: 'Groceries', type: 'expense' }
  }

  // ── FOOD & DINING ─────────────────────────────────────────────────────
  if (/pizza hut|dominos|domino's|saravana bhavan|bawarchi|brooklyn donuts|\bgyg\b|gelatissimo|nandos|nando's/i.test(raw)) {
    return { category: 'Food & Dining', subcategory: 'Restaurants', type: 'expense' }
  }
  if (/\bBWS\b/i.test(raw)) {
    return { category: 'Food & Dining', subcategory: 'Restaurants', type: 'expense' }
  }

  // ── ENTERTAINMENT ─────────────────────────────────────────────────────
  if (/netflix/i.test(raw)) {
    return { category: 'Entertainment', subcategory: 'Streaming', type: 'expense' }
  }
  if (/amznprimea|amazon prime/i.test(raw)) {
    return { category: 'Entertainment', subcategory: 'Streaming', type: 'expense' }
  }
  if (/kingpin bowling/i.test(raw)) {
    return { category: 'Entertainment', subcategory: 'Movies & Events', type: 'expense' }
  }
  if (/aquaticachievers|sharky sports/i.test(raw)) {
    return { category: 'Entertainment', subcategory: 'Sports & Swimming (Mehaan)', type: 'expense' }
  }

  // ── HEALTH ────────────────────────────────────────────────────────────
  if (/clublime/i.test(raw)) {
    return { category: 'Health', subcategory: 'Gym & Fitness', type: 'expense' }
  }
  if (/friendly care/i.test(raw)) {
    return { category: 'Health', subcategory: 'Medical', type: 'expense' }
  }

  // ── UTILITIES ─────────────────────────────────────────────────────────
  if (/\bAGL\b/i.test(raw)) {
    return { category: 'Utilities', subcategory: 'Electricity & Gas', type: 'expense' }
  }
  if (/wooliesmobile/i.test(raw)) {
    return { category: 'Utilities', subcategory: 'Internet & Phone', type: 'expense' }
  }
  if (/dodo services/i.test(raw)) {
    return { category: 'Utilities', subcategory: 'Internet & Phone', type: 'expense' }
  }
  if (/aldimobile/i.test(raw)) {
    return { category: 'Utilities', subcategory: 'Internet & Phone', type: 'expense' }
  }

  // ── SUBSCRIPTIONS ─────────────────────────────────────────────────────
  if (/josh w comeau/i.test(raw)) {
    return { category: 'Subscriptions', subcategory: 'Course', type: 'expense' }
  }

  // ── KMK DIGITAL EXPENSES ──────────────────────────────────────────────
  if (/\bASIC\b/i.test(raw)) {
    return { category: 'KMK Digital Expenses', subcategory: 'Business', type: 'expense' }
  }
  if (/eds pcs|digital pacific/i.test(raw)) {
    return { category: 'KMK Digital Expenses', subcategory: 'Business', type: 'expense' }
  }
  if (/officeworks/i.test(raw)) {
    return { category: 'KMK Digital Expenses', subcategory: 'Business', type: 'expense' }
  }

  // ── SHOPPING ──────────────────────────────────────────────────────────
  if (/\bbig w\b/i.test(raw)) {
    return { category: 'Shopping', subcategory: 'General', type: 'expense' }
  }
  if (/bunnings/i.test(raw)) {
    return { category: 'Shopping', subcategory: 'General', type: 'expense' }
  }
  if (/\bkmart\b/i.test(raw)) {
    return { category: 'Shopping', subcategory: 'General', type: 'expense' }
  }

  // ── EDUCATION ─────────────────────────────────────────────────────────
  if (/tinythinkers|shaw rd news wavell/i.test(raw)) {
    return { category: 'Education', subcategory: 'Kids Education', type: 'expense' }
  }

  // ── HOUSING ───────────────────────────────────────────────────────────
  if (/bcc rates/i.test(raw)) {
    return { category: 'Housing', subcategory: '7 Northmarque St (Carseldine)', type: 'expense' }
  }

  // ── OVERSEAS TRANSFER ─────────────────────────────────────────────────
  if (/^rmtly\*/i.test(raw) || /^rmtl\*/i.test(raw)) {
    return { category: 'Overseas Transfer', subcategory: 'Remitly', type: 'expense' }
  }

  // ── GENERIC KEYWORD RULES ─────────────────────────────────────────────
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (desc.includes(kw.toLowerCase())) {
        const type = rule.category === 'Income' ? 'income' : 'expense'
        return { category: rule.category, subcategory: rule.subcategory, type }
      }
    }
  }

  // Fallback
  if (amount > 0) {
    return { category: 'Income', subcategory: 'Other Income', type: 'income' }
  }
  return { category: 'Other', subcategory: 'Miscellaneous', type: 'expense' }
}

export function detectColumns(headers: string[]): { date: string; description: string; amount: string; credit?: string; debit?: string } {
  const lower = headers.map(h => h.toLowerCase().trim())

  const find = (keywords: string[]) =>
    headers[lower.findIndex(h => keywords.some(k => h.includes(k)))] || ''

  const date = find(['date', 'transaction date', 'posted', 'time'])
  const description = find(['description', 'memo', 'payee', 'merchant', 'details', 'narration', 'particulars', 'remarks'])
  const amount = find(['amount', 'value'])
  const credit = find(['credit', 'deposit', 'credits'])
  const debit = find(['debit', 'withdrawal', 'debits', 'charge'])

  return { date, description, amount, credit, debit }
}

export function parseAmount(val: string): number {
  if (!val) return 0
  const cleaned = val.replace(/[$,€£\s]/g, '').trim()
  return parseFloat(cleaned) || 0
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
