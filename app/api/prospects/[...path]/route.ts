import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

interface RouteContext {
  params: {
    path: string[];
  };
}

// GET - Liste tous les prospects ou détail d'un prospect ou sous-ressources
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // GET /api/prospects - Liste tous les prospects
    if (!path || path.length === 0) {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/prospects/[id] - Détail d'un prospect
    if (path.length === 1) {
      const prospectId = path[0];
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('id', prospectId)
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: 'Prospect not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(data);
    }

    // GET /api/prospects/[id]/exchanges - Exchanges d'un prospect
    if (path.length === 2 && path[1] === 'exchanges') {
      const prospectId = path[0];
      const { data, error } = await supabase
        .from('exchanges')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/prospects/[id]/notes - Notes d'un prospect
    if (path.length === 2 && path[1] === 'notes') {
      const prospectId = path[0];
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/prospects/[id]/docs - Documents d'un prospect
    if (path.length === 2 && path[1] === 'docs') {
      const prospectId = path[0];
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('GET /api/prospects error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau prospect
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // POST /api/prospects - Créer un prospect
    if (!path || path.length === 0) {
      const body = await request.json();
      const { data, error } = await supabase
        .from('prospects')
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('POST /api/prospects error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un prospect
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // PUT /api/prospects/[id] - Update un prospect
    if (path && path.length === 1) {
      const prospectId = path[0];
      const body = await request.json();

      const { data, error } = await supabase
        .from('prospects')
        .update(body)
        .eq('id', prospectId)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: 'Prospect not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('PUT /api/prospects error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour partiellement un prospect
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return PUT(request, context);
}

// DELETE - Supprimer un prospect
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // DELETE /api/prospects/[id] - Delete un prospect
    if (path && path.length === 1) {
      const prospectId = path[0];

      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', prospectId);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('DELETE /api/prospects error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
