import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    path?: string[];
  }>;
}

// GET - Liste tous les exchanges ou détail d'un exchange
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get("prospect_id");

    // GET /api/exchanges?prospect_id=xxx - Liste les exchanges d'un prospect
    if ((!path || path.length === 0) && prospectId) {
      const { data, error } = await supabase
        .from("exchanges")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/exchanges - Liste tous les exchanges
    if (!path || path.length === 0) {
      const { data, error } = await supabase
        .from("exchanges")
        .select("*, prospects(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/exchanges/[id] - Détail d'un exchange
    if (path.length === 1) {
      const exchangeId = path[0];
      const { data, error } = await supabase
        .from("exchanges")
        .select("*, prospects(*)")
        .eq("id", exchangeId)
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: "Exchange not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/exchanges error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST - Créer un nouveau exchange
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // POST /api/exchanges - Créer un exchange
    if (!path || path.length === 0) {
      const body = await request.json();
      const { data, error } = await supabase
        .from("exchanges")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("POST /api/exchanges error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT - Mettre à jour un exchange
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // PUT /api/exchanges/[id] - Update un exchange
    if (path && path.length === 1) {
      const exchangeId = path[0];
      const body = await request.json();

      const { data, error } = await supabase
        .from("exchanges")
        .update(body)
        .eq("id", exchangeId)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: "Exchange not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/exchanges error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PATCH - Mettre à jour partiellement un exchange
export async function PATCH(request: NextRequest, context: RouteContext) {
  return PUT(request, context);
}

// DELETE - Supprimer un exchange
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // DELETE /api/exchanges/[id] - Delete un exchange
    if (path && path.length === 1) {
      const exchangeId = path[0];

      const { error } = await supabase
        .from("exchanges")
        .delete()
        .eq("id", exchangeId);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/exchanges error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
