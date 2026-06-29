import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ProposalView } from '@/components/ProposalView'
import { ProductionProposalView } from '@/components/ProductionProposalView'
import type { ProposalData, ProductionProposalData } from '@/lib/types'

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) notFound()

  supabaseAdmin()
    .from('proposals')
    .update({ viewed_at: new Date().toISOString() })
    .eq('slug', slug)
    .then(() => {})

  const proposalData = data.data as Record<string, unknown>

  // Production proposals have line_items; AI proposals have phases
  if (Array.isArray(proposalData.line_items)) {
    return <ProductionProposalView data={proposalData as unknown as ProductionProposalData} />
  }

  return <ProposalView data={proposalData as unknown as ProposalData} />
}
