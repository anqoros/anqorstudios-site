'use client'

import { useState, useMemo } from 'react'
import type { ProductionProposalData, LineItem } from '@/lib/types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

function isToggleable(item: LineItem) {
  return item.half_day_price_aed != null && item.full_day_price_aed != null
}

export function ProductionProposalView({ data }: { data: ProductionProposalData }) {
  // track which items are showing full-day (default: whatever was saved)
  const [fullDay, setFullDay] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {}
    data.line_items.forEach((item, i) => {
      if (isToggleable(item)) {
        // if saved price matches full day price, default to full day
        init[i] = item.unit_price_aed === item.full_day_price_aed
      }
    })
    return init
  })

  const activeItems = useMemo(() => {
    return data.line_items.map((item, i) => {
      if (!isToggleable(item)) return item
      const isFull = fullDay[i]
      return {
        ...item,
        description: isFull ? (item.full_day_desc ?? item.description) : (item.half_day_desc ?? item.description),
        unit_price_aed: isFull ? item.full_day_price_aed! : item.half_day_price_aed!,
        total_aed: item.quantity * (isFull ? item.full_day_price_aed! : item.half_day_price_aed!),
      }
    })
  }, [data.line_items, fullDay])

  const ownItems  = activeItems.filter(i => i.type === 'own')
  const ptItems   = activeItems.filter(i => i.type === 'pass_through')
  const ownSub    = ownItems.reduce((s, i) => s + i.total_aed, 0)
  const ptSub     = ptItems.reduce((s, i) => s + i.total_aed, 0)
  const subtotal  = ownSub + ptSub
  const vat       = subtotal * 0.05
  const total     = subtotal + vat
  const advPct    = data.payment_terms.anqor_advance_pct
  const balPct    = data.payment_terms.anqor_balance_pct
  const ownDueNow = ownSub * 1.05 * advPct / 100
  const ptDueNow  = ptSub  * 1.05
  const dueOnSigning  = ownDueNow + ptDueNow
  const dueOnDelivery = ownSub * 1.05 * balPct / 100

  const toggleItem = (i: number) => {
    setFullDay(prev => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div style={{ background: '#F2EFE9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 32px 100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56, borderBottom: '2px solid #1a1a1a', paddingBottom: 28 }}>
          <img src="/anqor_logo.png" alt="Anqor Studios" style={{ height: 36 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888' }}>Project Proposal</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{data.date}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Prepared for {data.client.name}</div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#1a1a1a', margin: '0 0 8px' }}>{data.title}</h1>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 40px' }}>Prepared by Ubong Essien · Anqor Studios</p>

        {data.overview && (
          <div style={{ background: 'white', borderRadius: 10, padding: '24px 28px', marginBottom: 36 }}>
            <div style={labelStyle}>Project Overview</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#333', margin: 0 }}>{data.overview}</p>
          </div>
        )}

        {data.timeline && (
          <div style={{ background: 'white', borderRadius: 10, padding: '24px 28px', marginBottom: 36 }}>
            <div style={labelStyle}>Timeline</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#333', margin: 0 }}>{data.timeline}</p>
          </div>
        )}

        {/* Line Items */}
        <div style={{ marginBottom: 8 }}>
          <div style={labelStyle}>Scope of Work &amp; Fees</div>
        </div>

        <div style={{ background: 'white', borderRadius: 10, overflow: 'hidden', marginBottom: 4 }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 120px 120px', gap: 0, background: '#f5f5f3', padding: '10px 20px', borderBottom: '1px solid #eee' }}>
            {['Description', 'Qty', 'Unit Price', 'Total'].map((h, i) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', textAlign: i > 0 ? 'right' : 'left' }}>{h}</div>
            ))}
          </div>

          {/* Own services */}
          {ownItems.length > 0 && (
            <>
              <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2e7d52', background: '#f9fdfb' }}>
                Anqor Studios Services
              </div>
              {data.line_items.map((item, i) => {
                if (item.type !== 'own') return null
                const active = activeItems[i]
                const toggleable = isToggleable(item)
                const isFull = fullDay[i]
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 120px 120px', gap: 0, padding: '12px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#1a1a1a' }}>{active.description}</div>
                      {toggleable && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                          <button
                            onClick={() => !isFull && toggleItem(i)}
                            style={{ ...toggleBtn, background: !isFull ? '#1a1a1a' : 'transparent', color: !isFull ? 'white' : '#888', border: !isFull ? '1px solid #1a1a1a' : '1px solid #ddd' }}
                          >HD</button>
                          <button
                            onClick={() => isFull && toggleItem(i)}
                            style={{ ...toggleBtn, background: isFull ? '#1a1a1a' : 'transparent', color: isFull ? 'white' : '#888', border: isFull ? '1px solid #1a1a1a' : '1px solid #ddd' }}
                          >FD</button>
                          <span style={{ fontSize: 10, color: '#aaa', alignSelf: 'center' }}>{!isFull ? 'half day · 4h' : 'full day · 8h'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, textAlign: 'right', color: '#555' }}>{active.quantity}</div>
                    <div style={{ fontSize: 13, textAlign: 'right', color: '#555' }}>AED {fmt(active.unit_price_aed)}</div>
                    <div style={{ fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#1a1a1a' }}>AED {fmt(active.total_aed)}</div>
                  </div>
                )
              })}
            </>
          )}

          {/* Third-party */}
          {ptItems.length > 0 && (
            <>
              <div style={{ padding: '8px 20px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c8882a', background: '#fdfaf5' }}>
                Third-Party Costs (vendor pass-through)
              </div>
              {data.line_items.map((item, i) => {
                if (item.type !== 'pass_through') return null
                const active = activeItems[i]
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 120px 120px', gap: 0, padding: '12px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: '#1a1a1a' }}>{active.description}</div>
                    <div style={{ fontSize: 13, textAlign: 'right', color: '#555' }}>{active.quantity}</div>
                    <div style={{ fontSize: 13, textAlign: 'right', color: '#555' }}>AED {fmt(active.unit_price_aed)}</div>
                    <div style={{ fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#c8882a' }}>AED {fmt(active.total_aed)}</div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 36 }}>
          <div style={{ width: 300, background: 'white', borderRadius: 10, padding: '20px 24px' }}>
            {ownSub > 0 && <TotRow label="Anqor Services" value={`AED ${fmt(ownSub)}`} />}
            {ptSub > 0  && <TotRow label="Third-Party Costs" value={`AED ${fmt(ptSub)}`} amber />}
            <TotRow label="Subtotal" value={`AED ${fmt(subtotal)}`} />
            <TotRow label="VAT (5%)" value={`AED ${fmt(vat)}`} muted />
            <TotRow label="Total" value={`AED ${fmt(total)}`} bold border />
          </div>
        </div>

        {/* Payment Schedule */}
        <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '28px 32px', marginBottom: 36, color: 'white' }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 20 }}>Payment Schedule</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #333' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Due on signing</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Anqor deposit ({advPct}%) + all third-party costs (100%)</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>AED {fmt(dueOnSigning)}</div>
          </div>
          {ptSub > 0 && (
            <div style={{ fontSize: 11, color: '#666', paddingLeft: 12, marginBottom: 4 }}>↳ Anqor deposit · AED {fmt(ownDueNow)}</div>
          )}
          {ptSub > 0 && (
            <div style={{ fontSize: 11, color: '#666', paddingLeft: 12, marginBottom: 12 }}>↳ Third-party costs (100% upfront) · AED {fmt(ptDueNow)}</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Balance on delivery</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{balPct}% of Anqor fee · due on final file delivery</div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>AED {fmt(dueOnDelivery)}</div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #333', fontSize: 11, color: '#666', lineHeight: 1.6 }}>
            Payment by bank transfer · Account Title: Anqor Studios L.L.C-FZ · Account No: 3003731440000001 · Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba, Dubai, UAE
          </div>
        </div>

        {data.notes && (
          <div style={{ background: 'white', borderRadius: 10, padding: '24px 28px', marginBottom: 36 }}>
            <div style={labelStyle}>Notes</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#333', margin: 0 }}>{data.notes}</p>
          </div>
        )}

        {/* Terms & Conditions */}
        <div style={{ marginBottom: 48 }}>
          <div style={labelStyle}>Terms &amp; Conditions</div>
          <div style={{ background: 'white', borderRadius: 10, padding: '28px 32px' }}>
            {TERMS.map((t, i) => (
              <div key={i} style={{ marginBottom: i < TERMS.length - 1 ? 20 : 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a1a', marginBottom: 6 }}>{t.title}</div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: '#555', margin: 0 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Ready to move forward?</div>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Book a call with Ubong to confirm details and get started.</p>
          <a href="https://cal.com/anqorstudios" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#1a1a1a', color: 'white', padding: '14px 36px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Book a Call
          </a>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #d8d4cc', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
          <span>Anqor Studios · Dubai, UAE · hello@anqorstudios.com</span>
          <span>{data.prepared_by} · {data.date}</span>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TotRow({ label, value, bold, muted, amber, border }: { label: string; value: string; bold?: boolean; muted?: boolean; amber?: boolean; border?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: border ? '2px solid #1a1a1a' : undefined, marginTop: border ? 8 : 0 }}>
      <span style={{ fontSize: 12, color: muted ? '#888' : '#444' }}>{label}</span>
      <span style={{ fontSize: bold ? 15 : 12, fontWeight: bold ? 800 : 500, color: amber ? '#c8882a' : '#1a1a1a' }}>{value}</span>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#888',
  marginBottom: 12,
}

const toggleBtn: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 4,
  cursor: 'pointer',
  letterSpacing: '0.05em',
  transition: 'all 0.15s',
}

// ── Terms ─────────────────────────────────────────────────────────────────────

const TERMS = [
  {
    title: '1. Agreement',
    body: 'This proposal constitutes a binding agreement upon receipt of the advance payment. By making payment, the client confirms acceptance of all terms herein.',
  },
  {
    title: '2. Payment Terms',
    body: 'An advance is due upon signing — this covers the agreed deposit on Anqor fees plus 100% of any third-party costs. Final deliverables are released only upon receipt of the remaining balance. Invoices unpaid after 7 days of the due date attract a late fee of 2% per month.',
  },
  {
    title: '3. Shoot Duration & Overtime',
    body: 'Half-day bookings cover up to 4 hours. Full-day bookings cover up to 8 hours. If a half-day shoot runs past 4 hours, the client will be upgraded to the full-day rate and invoiced the difference. Time past 8 hours is billed at the applicable hourly overtime rate (1.5×). Overtime is invoiced separately after the shoot.',
  },
  {
    title: '4. Revisions',
    body: 'One round of revisions is included unless otherwise stated. Additional rounds are billed at AED 500 per round for photo/copy edits, or at an agreed hourly rate for video. Revision requests must be submitted in writing within 7 days of delivery.',
  },
  {
    title: '5. Cancellation & Postponement',
    body: 'Cancellation with 14+ days notice: advance refunded minus committed third-party costs. Cancellation with 7–14 days notice: 50% of the Anqor fee is forfeited; third-party costs are non-refundable. Cancellation with under 7 days notice: full Anqor fee forfeited; third-party costs non-refundable. One complimentary postponement is permitted with minimum 7 days notice, subject to availability.',
  },
  {
    title: '6. Intellectual Property & Usage Rights',
    body: 'Anqor Studios retains copyright over all work produced until full payment is received. Upon final payment, the client receives a perpetual, non-exclusive licence to use delivered assets for the purposes described in this proposal. Raw/unedited files are not included unless explicitly listed. Anqor Studios retains the right to display work in its portfolio unless confidentiality is requested in writing prior to the shoot.',
  },
  {
    title: '7. Third-Party Vendors',
    body: 'Anqor Studios acts as intermediary for third-party services and is not liable for third-party cancellations, delays, or quality issues beyond our reasonable control.',
  },
  {
    title: '8. Limitation of Liability',
    body: "Anqor Studios' total liability shall not exceed the total fees paid. We are not liable for indirect or consequential damages. In the event of equipment failure or force majeure, Anqor Studios will offer a rescheduled shoot at no additional fee.",
  },
  {
    title: '9. Governing Law',
    body: 'This agreement is governed by the laws of the United Arab Emirates. Disputes shall be resolved in the courts of Dubai, UAE.',
  },
]
