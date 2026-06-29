export type ProposalData = {
  title: string
  overview: string
  tagline: string
  client: {
    name: string
    industry: string
    current_situation: string[]
    goals: string[]
  }
  phases: {
    number: string
    label: string
    title: string
    description: string
    deliverables: string[]
    price_aed: number
  }[]
  total_price_aed: number
  timeline: string
  prepared_by: string
  date: string
}

export type LineItem = {
  description: string
  quantity: number
  unit_price_aed: number
  total_aed: number
  type: 'own' | 'pass_through'
  // half/full day toggle support
  half_day_price_aed?: number
  full_day_price_aed?: number
  half_day_desc?: string
  full_day_desc?: string
}

export type ProductionProposalData = {
  title: string
  overview?: string
  client: { name: string; email?: string | null }
  line_items: LineItem[]
  own_services_subtotal: number
  third_party_subtotal: number
  subtotal_aed: number
  vat_aed: number
  total_incl_vat: number
  timeline?: string
  payment_terms: {
    anqor_advance_pct: number
    anqor_balance_pct: number
    third_party: string
    due_on_signing_aed: number
    balance_on_delivery_aed: number
  }
  notes?: string | null
  prepared_by: string
  date: string
}

export type InvoiceData = {
  invoice_number: string
  client_name: string
  client_email?: string
  date: string
  due_date: string
  items: {
    description: string
    quantity: number
    unit_price_aed: number
    total_aed: number
  }[]
  subtotal_aed: number
  vat_rate: number
  vat_aed: number
  total_aed: number
  payment_instructions: string
  notes?: string
}
