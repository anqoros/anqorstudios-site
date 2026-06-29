/**
 * ANQOR STUDIOS — SERVICE CATALOG
 * Edit prices here. Changes apply immediately to Brief Uploader and Quote Generator.
 *
 * Fields:
 *   name          — display name (shown in quotes and proposals)
 *   section       — 'own' (Anqor's fee) | 'pass_through' (third-party vendor, marked up 15-20%)
 *   halfDayPrice  — AED price for half day (4h). null if not applicable.
 *   fullDayPrice  — AED price for full day (8h), OR the single unit price if no half-day option.
 *   unit          — optional: 'per image' | 'per hour' | 'per person' | 'per language' | 'per second' etc.
 *                   Leave null for day-rate items.
 *   notes         — optional: shown in catalog description e.g. "≤10 pax" or "1yr online rights"
 */
window.AQ_CATALOG = [

  // ── OWN SERVICES (Anqor's fees) ──────────────────────────────────────────────

  // Photography
  { name: 'Photography',                              section: 'own', halfDayPrice: 1500,  fullDayPrice: 3000,  unit: null,           notes: '4h / 8h' },
  { name: 'Additional Hour — Photography',            section: 'own', halfDayPrice: null,  fullDayPrice: 1000,  unit: 'per hour',     notes: null },
  { name: 'Corporate Headshots',                      section: 'own', halfDayPrice: 4500,  fullDayPrice: 7000,  unit: null,           notes: '≤10 pax / ≤20 pax' },
  { name: 'Image Editing & Retouching',               section: 'own', halfDayPrice: null,  fullDayPrice: 150,   unit: 'per image',    notes: null },
  { name: 'Rush Editing — 48hr Delivery',             section: 'own', halfDayPrice: null,  fullDayPrice: 500,   unit: null,           notes: null },

  // Video Production
  { name: 'Videographer',                             section: 'own', halfDayPrice: 4500,  fullDayPrice: 7500,  unit: null,           notes: '4h / 8h' },
  { name: 'Director of Photography',                  section: 'own', halfDayPrice: null,  fullDayPrice: 9000,  unit: null,           notes: 'Full Day' },
  { name: 'Filming, Direction & Camera Package',      section: 'own', halfDayPrice: null,  fullDayPrice: 6500,  unit: null,           notes: null },
  { name: 'Event Coverage — Photo + Video',           section: 'own', halfDayPrice: 7000,  fullDayPrice: 10000, unit: null,           notes: '4h / 8h' },
  { name: 'Corporate Brand Film',                     section: 'own', halfDayPrice: null,  fullDayPrice: 16000, unit: null,           notes: 'shoot + post, up to 3min' },
  { name: 'Social Media Content Day',                 section: 'own', halfDayPrice: null,  fullDayPrice: 9000,  unit: null,           notes: 'up to 10 assets' },

  // Video Editing
  { name: 'Video Edit — up to 30 seconds',            section: 'own', halfDayPrice: null,  fullDayPrice: 700,   unit: null,           notes: null },
  { name: 'Video Edit — up to 60 seconds',            section: 'own', halfDayPrice: null,  fullDayPrice: 1100,  unit: null,           notes: null },
  { name: 'Video Edit — 1–2 minutes',                 section: 'own', halfDayPrice: null,  fullDayPrice: 1800,  unit: null,           notes: null },
  { name: 'Video Edit — 2–3 minutes',                 section: 'own', halfDayPrice: null,  fullDayPrice: 2500,  unit: null,           notes: null },
  { name: 'Video Edit — 3–5 minutes',                 section: 'own', halfDayPrice: null,  fullDayPrice: 3500,  unit: null,           notes: null },
  { name: 'Video Edit — 5–10 minutes',                section: 'own', halfDayPrice: null,  fullDayPrice: 6500,  unit: null,           notes: null },
  { name: 'Vertical Format / Reel Cut-Down',          section: 'own', halfDayPrice: null,  fullDayPrice: 500,   unit: null,           notes: null },
  { name: 'Color Grade — Full Project',               section: 'own', halfDayPrice: null,  fullDayPrice: 1500,  unit: null,           notes: null },
  { name: 'Sound Design & Audio Mix',                 section: 'own', halfDayPrice: null,  fullDayPrice: 1200,  unit: null,           notes: null },
  { name: 'Motion Graphics',                          section: 'own', halfDayPrice: null,  fullDayPrice: 2000,  unit: 'per 30 seconds', notes: null },
  { name: 'Additional Revision Round',                section: 'own', halfDayPrice: null,  fullDayPrice: 500,   unit: null,           notes: null },
  { name: 'Rush Delivery — 48hr Turnaround',          section: 'own', halfDayPrice: null,  fullDayPrice: 750,   unit: null,           notes: null },

  // Podcast
  { name: 'Podcast Episode Edit',                     section: 'own', halfDayPrice: null,  fullDayPrice: 1200,  unit: null,           notes: 'up to 60 min' },
  { name: 'Podcast Promo Clips — 3 clips',            section: 'own', halfDayPrice: null,  fullDayPrice: 900,   unit: null,           notes: null },
  { name: 'Podcast Promo Clips — 6 clips',            section: 'own', halfDayPrice: null,  fullDayPrice: 1500,  unit: null,           notes: null },
  { name: 'Voiceover Record & Mix',                   section: 'own', halfDayPrice: null,  fullDayPrice: 1500,  unit: null,           notes: null },
  { name: 'Audio Cleanup & Noise Reduction',          section: 'own', halfDayPrice: null,  fullDayPrice: 600,   unit: null,           notes: null },

  // Creative & Strategy
  { name: 'Creative Direction & Pre-Production',      section: 'own', halfDayPrice: null,  fullDayPrice: 2500,  unit: null,           notes: null },
  { name: 'Moodboard & Concept Deck',                 section: 'own', halfDayPrice: null,  fullDayPrice: 1500,  unit: null,           notes: null },
  { name: 'Styling & Art Direction',                  section: 'own', halfDayPrice: null,  fullDayPrice: 2000,  unit: null,           notes: null },
  { name: 'Scriptwriting & Storyboard',               section: 'own', halfDayPrice: null,  fullDayPrice: 2500,  unit: null,           notes: null },

  // Packages
  { name: 'Content Day Package — Photo + Video + 5 Reels Edit', section: 'own', halfDayPrice: null, fullDayPrice: 18000, unit: null, notes: null },
  { name: 'Starter Brand Film — 1 Shoot Day + 2min Edit + 3 Reels', section: 'own', halfDayPrice: null, fullDayPrice: 16000, unit: null, notes: null },
  { name: 'Monthly Content Retainer — Basic',         section: 'own', halfDayPrice: null,  fullDayPrice: 7000,  unit: 'per month',    notes: '8 assets/mo' },
  { name: 'Monthly Content Retainer — Growth',        section: 'own', halfDayPrice: null,  fullDayPrice: 12000, unit: 'per month',    notes: '16 assets/mo' },

  // ── PASS-THROUGH (third-party vendors — Anqor adds 15-20% markup) ────────────

  // Studio & Equipment
  { name: 'Studio Hire',                              section: 'pass_through', halfDayPrice: 1200, fullDayPrice: 2000, unit: null, notes: '4h / 8h' },
  { name: 'Lighting Package',                         section: 'pass_through', halfDayPrice: null, fullDayPrice: 800,  unit: null, notes: null },
  { name: 'Lighting Technician',                      section: 'pass_through', halfDayPrice: null, fullDayPrice: 1000, unit: null, notes: 'Full Day' },
  { name: 'B-Camera / Second Angle',                  section: 'pass_through', halfDayPrice: null, fullDayPrice: 2000, unit: null, notes: null },
  { name: 'Drone',                                    section: 'pass_through', halfDayPrice: 2500, fullDayPrice: 4000, unit: null, notes: 'with licensed pilot' },
  { name: 'Teleprompter',                             section: 'pass_through', halfDayPrice: null, fullDayPrice: 500,  unit: null, notes: null },
  { name: 'Generator',                                section: 'pass_through', halfDayPrice: null, fullDayPrice: 600,  unit: null, notes: 'on-location power' },

  // Talent & Crew
  { name: 'Model',                                    section: 'pass_through', halfDayPrice: 3000, fullDayPrice: 5500, unit: null, notes: '1yr online rights' },
  { name: 'MUA',                                      section: 'pass_through', halfDayPrice: 2000, fullDayPrice: 3500, unit: null, notes: '4h / 8h' },
  { name: 'Hairstylist',                              section: 'pass_through', halfDayPrice: 2000, fullDayPrice: 3500, unit: null, notes: '4h / 8h' },
  { name: 'Wardrobe Stylist',                         section: 'pass_through', halfDayPrice: null, fullDayPrice: 2500, unit: null, notes: 'Full Day' },
  { name: 'Production Assistant',                     section: 'pass_through', halfDayPrice: null, fullDayPrice: 800,  unit: null, notes: 'Full Day' },

  // Location & Logistics
  { name: 'Location Scout & Coordination',            section: 'pass_through', halfDayPrice: null, fullDayPrice: 1500, unit: null, notes: null },
  { name: 'Location / Venue Hire',                    section: 'pass_through', halfDayPrice: null, fullDayPrice: 2500, unit: null, notes: null },
  { name: 'Government Filming Permit',                section: 'pass_through', halfDayPrice: null, fullDayPrice: 800,  unit: null, notes: null },
  { name: 'Catering — Crew',                          section: 'pass_through', halfDayPrice: null, fullDayPrice: 100,  unit: 'per person', notes: null },

  // Outsourced Post
  { name: 'CGI / 3D Animation',                      section: 'pass_through', halfDayPrice: null, fullDayPrice: 800,  unit: 'per second', notes: 'outsourced' },
  { name: 'CGI — Full Package',                       section: 'pass_through', halfDayPrice: null, fullDayPrice: 8000, unit: null, notes: 'outsourced' },
  { name: 'Voiceover Artist',                         section: 'pass_through', halfDayPrice: null, fullDayPrice: 1500, unit: null, notes: 'outsourced' },
  { name: 'Translator / Subtitles',                   section: 'pass_through', halfDayPrice: null, fullDayPrice: 600,  unit: 'per language', notes: null },

];

/**
 * Builds the catalog string that gets sent to the AI prompt.
 * Called by brief-uploader.html. Do not edit this function — edit the data above.
 */
window.buildCatalogString = function() {
  const own = window.AQ_CATALOG.filter(i => i.section === 'own');
  const pt  = window.AQ_CATALOG.filter(i => i.section === 'pass_through');

  function fmtItem(i) {
    if (i.halfDayPrice) {
      return `- ${i.name} — Half Day${i.notes ? ' ('+i.notes.split('/')[0].trim()+')' : ''} | AED ${i.halfDayPrice.toLocaleString()}\n` +
             `- ${i.name} — Full Day${i.notes ? ' ('+i.notes.split('/').pop().trim()+')' : ''} | AED ${i.fullDayPrice.toLocaleString()}`;
    }
    const unitStr = i.unit ? ` | AED ${i.fullDayPrice.toLocaleString()} ${i.unit}` : ` | AED ${i.fullDayPrice.toLocaleString()}`;
    const noteStr = i.notes ? ` (${i.notes})` : '';
    return `- ${i.name}${noteStr}${unitStr}`;
  }

  return `ANQOR STUDIOS — SERVICE CATALOG (use these exact descriptions and prices):

SECTION: own (Anqor's own services, fixed prices)
${own.map(fmtItem).join('\n')}

SECTION: pass_through (third-party vendor costs — Anqor marks these up 15–20%, client sees higher price)
${pt.map(fmtItem).join('\n')}`;
};
