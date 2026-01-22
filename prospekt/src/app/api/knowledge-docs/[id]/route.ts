import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET - Récupérer un document spécifique
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await context.params;

    const { data, error } = await supabase
      .from('knowledge_docs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/knowledge-docs/[id] error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un document
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await context.params;
    const body = await request.json();

    const allowedFields = ['title', 'category', 'content', 'tags'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from('knowledge_docs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/knowledge-docs/[id] error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await context.params;

    const { error } = await supabase
      .from('knowledge_docs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/knowledge-docs/[id] error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
