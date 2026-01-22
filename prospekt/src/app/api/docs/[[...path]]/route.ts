import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Document } from "@/types";

interface RouteContext {
  params: Promise<{
    path?: string[];
  }>;
}

// GET - Liste tous les documents ou détail d'un document
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get("prospect_id");

    // GET /api/docs?prospect_id=xxx - Liste les documents d'un prospect
    if ((!path || path.length === 0) && prospectId) {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/docs - Liste tous les documents
    if (!path || path.length === 0) {
      const { data, error } = await supabase
        .from("documents")
        .select("*, prospects(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // GET /api/docs/[id] - Détail d'un document
    if (path.length === 1) {
      const docId = path[0];
      const { data, error } = await supabase
        .from("documents")
        .select("*, prospects(*)")
        .eq("id", docId)
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(data);
    }

    // GET /api/docs/[id]/download - Télécharger un document
    if (path.length === 2 && path[1] === "download") {
      const docId = path[0];

      // Récupérer les infos du document
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", docId)
        .single();

      if (docError) throw docError;
      const typedDoc = doc as Document;
      if (!typedDoc || !typedDoc.file_path) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 },
        );
      }

      // Générer une URL signée pour le téléchargement
      const { data: signedUrl, error: signError } = await supabase.storage
        .from("documents")
        .createSignedUrl(typedDoc.file_path, 60); // URL valide 60 secondes

      if (signError) throw signError;

      return NextResponse.json({
        url: signedUrl.signedUrl,
        filename: typedDoc.filename,
        content_type: typedDoc.content_type,
      });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/docs error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// POST - Uploader un nouveau document
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // POST /api/docs - Upload un document
    if (!path || path.length === 0) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const prospectId = formData.get("prospect_id") as string;
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      if (!file || !prospectId) {
        return NextResponse.json(
          { error: "File and prospect_id are required" },
          { status: 400 },
        );
      }

      // Upload le fichier dans Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${prospectId}/${Date.now()}.${fileExt}`;
      const fileBuffer = await file.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Créer l'entrée dans la base de données
      const documentData = {
        prospect_id: prospectId,
        title: title || file.name,
        description: description || null,
        filename: file.name,
        file_path: uploadData.path,
        content_type: file.type,
        file_size: file.size,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("POST /api/docs error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PUT - Mettre à jour un document
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // PUT /api/docs/[id] - Update un document (métadonnées uniquement)
    if (path && path.length === 1) {
      const docId = path[0];
      const body = await request.json();

      // Ne permettre que la mise à jour des métadonnées
      const allowedFields = ["title", "description"];
      const updateData: any = {};
      for (const field of allowedFields) {
        if (field in body) {
          updateData[field] = body[field];
        }
      }

      const { data, error } = await supabase
        .from("documents")
        .update(updateData)
        .eq("id", docId)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/docs error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// PATCH - Mettre à jour partiellement un document
export async function PATCH(request: NextRequest, context: RouteContext) {
  return PUT(request, context);
}

// DELETE - Supprimer un document
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { path } = await context.params;

    // DELETE /api/docs/[id] - Delete un document
    if (path && path.length === 1) {
      const docId = path[0];

      // Récupérer le document pour obtenir le chemin du fichier
      const { data: doc, error: fetchError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", docId)
        .single();

      if (fetchError) throw fetchError;

      if (doc && doc.file_path) {
        // Supprimer le fichier du storage
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([doc.file_path]);

        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continuer même si la suppression du fichier échoue
        }
      }

      // Supprimer l'entrée de la base de données
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/docs error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
