import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET - Liste tous les documents de documentation avec recherche et filtres
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    let query = supabase
      .from('knowledge_docs')
      .select('*')
      .order('updated_at', { ascending: false });

    // Recherche full-text sur titre et contenu
    if (search && search.trim() !== '') {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Filtre par catégorie
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filtre par tag
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/knowledge-docs error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau document de documentation
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { title, category, content, tags } = body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'title, category, and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_docs')
      .insert({
        title,
        category,
        content,
        tags: tags || []
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/knowledge-docs error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
