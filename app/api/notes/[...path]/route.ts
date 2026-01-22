import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

interface RouteContext {
  params: {
    path: string[];
  };
}

// GET - Liste toutes les notes ou détail d'une note
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get('prospect_id');

    // GET /api/notes?prospect_id=xxx - Liste les notes d'un prospect
    if ((!path || path.length === 0) && prospectId) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('prospect_id', prospectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/notes - Liste toutes les notes
    if (!path || path.length === 0) {
      const { data, error } = await supabase
        .from('notes')
        .select('*, prospects(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/notes/[id] - Détail d'une note
    if (path.length === 1) {
      const noteId = path[0];
      const { data, error } = await supabase
        .from('notes')
        .select('*, prospects(*)')
        .eq('id', noteId)
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: 'Note not found' },
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
    console.error('GET /api/notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle note
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // POST /api/notes - Créer une note
    if (!path || path.length === 0) {
      const body = await request.json();
      const { data, error } = await supabase
        .from('notes')
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
    console.error('POST /api/notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une note
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // PUT /api/notes/[id] - Update une note
    if (path && path.length === 1) {
      const noteId = path[0];
      const body = await request.json();

      const { data, error } = await supabase
        .from('notes')
        .update(body)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: 'Note not found' },
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
    console.error('PUT /api/notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour partiellement une note
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return PUT(request, context);
}

// DELETE - Supprimer une note
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { path } = context.params;

    // DELETE /api/notes/[id] - Delete une note
    if (path && path.length === 1) {
      const noteId = path[0];

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Route not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('DELETE /api/notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
