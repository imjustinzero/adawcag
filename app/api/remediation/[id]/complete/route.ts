import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const { id } = await context.params;
  const { error } = await supabase.from('remediation_items').update({ status: 'Done', updated_at: new Date().toISOString() }).eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'UPDATE_FAILED', message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
