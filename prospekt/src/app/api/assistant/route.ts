import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseClient } from "@/lib/supabase";
import type { Prospect } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// POST - Assistant IA avec Claude
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, prospectId, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();
    let systemPrompt =
      "Tu es un assistant IA spécialisé dans la gestion de prospects. Tu aides à analyser les données des prospects, suggérer des actions et répondre aux questions.";

    // Si un prospectId est fourni, récupérer les données du prospect
    if (prospectId) {
      const { data: prospect, error: prospectError } = await supabase
        .from("prospects")
        .select("*")
        .eq("id", prospectId)
        .single();

      if (!prospectError && prospect) {
        const typedProspect = prospect as Prospect;
        // Récupérer les exchanges du prospect
        const { data: exchanges } = await supabase
          .from("exchanges")
          .select("*")
          .eq("prospect_id", prospectId)
          .order("created_at", { ascending: false })
          .limit(10);

        // Récupérer les notes du prospect
        const { data: notes } = await supabase
          .from("notes")
          .select("*")
          .eq("prospect_id", prospectId)
          .order("created_at", { ascending: false })
          .limit(10);

        systemPrompt = `Tu es un assistant IA spécialisé dans la gestion de prospects. Voici les informations du prospect actuel:

Prospect: ${typedProspect.contact_name}
Email: ${typedProspect.email || "Non renseigné"}
Téléphone: ${typedProspect.phone || "Non renseigné"}
Entreprise: ${typedProspect.company_name || "Non renseigné"}
Statut: ${typedProspect.status || "Non renseigné"}
Priorité: ${typedProspect.priority || "Non renseigné"}

${exchanges && exchanges.length > 0 ? `\nDerniers échanges:\n${exchanges.map((ex: any) => `- [${ex.type}] ${ex.subject || ex.content?.substring(0, 100)}`).join("\n")}` : ""}

${notes && notes.length > 0 ? `\nDernières notes:\n${notes.map((note: any) => `- ${note.content.substring(0, 100)}`).join("\n")}` : ""}

Aide l'utilisateur avec ce prospect en répondant à ses questions et en suggérant des actions pertinentes.`;
      }
    }

    // Ajouter le contexte supplémentaire si fourni
    if (context) {
      systemPrompt += `\n\nContexte supplémentaire: ${context}`;
    }

    // Appeler Claude
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      message: assistantMessage,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("POST /api/assistant error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: "Anthropic API error",
          details: error.message,
          status: error.status,
        },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET - Obtenir l'historique des conversations (optionnel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get("prospect_id");

    if (!prospectId) {
      return NextResponse.json(
        { error: "prospect_id is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Récupérer l'historique des conversations si vous avez une table pour ça
    // Sinon, retourner un message indiquant que la fonctionnalité n'est pas disponible

    return NextResponse.json({
      message: "Conversation history feature not implemented yet",
      prospectId,
    });
  } catch (error) {
    console.error("GET /api/assistant error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
