import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("chart");
  const symbol = String(form.get("symbol") || "XAU/USD");
  const timeframe = String(form.get("timeframe") || "15m");
  if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ error: "Chart image required." }, { status: 400 });

  const admin = adminClient();
  const { data: creditResult, error: creditError } = await admin.rpc("consume_analysis_credit", {
    p_user_id: user.id
  });
  if (creditError) return NextResponse.json({ error: creditError.message }, { status: 500 });
  if (!creditResult?.allowed) return NextResponse.json({ error: "No analysis credits left today.", code: "NO_CREDITS" }, { status: 402 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";
  const dataUrl = `data:${mime};base64,${bytes.toString("base64")}`;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      demo: true,
      symbol, timeframe,
      remaining: creditResult.remaining,
      analysis: {
        direction: "WAIT",
        confidence: 0,
        note: "AI provider is not connected yet. Your credit was consumed and the authentication/credit system is working."
      }
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are the analysis layer for SMC Trade. Analyze the supplied chart screenshot for ${symbol} on ${timeframe}. Do not claim certainty or guaranteed profit. Return ONLY valid JSON with keys: direction (BUY, SELL, WAIT), confidence (0-100; this is model confidence, not win probability), trend, structure, aggressive_plan {entry, tp1, tp2, sl, reason}, conservative_plan {entry, tp1, tp2, sl, reason}, risks. If the screenshot does not contain enough evidence, use WAIT and explain why.`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    input: [{
      role: "user",
      content: [
        { type: "input_text", text: prompt },
        { type: "input_image", image_url: dataUrl }
      ]
    }]
  });

  let parsed;
  try { parsed = JSON.parse(response.output_text); }
  catch { parsed = { direction:"WAIT", confidence:0, trend:"The AI returned an unstructured response.", risks: response.output_text }; }

  await admin.from("analyses").insert({
    user_id: user.id, symbol, timeframe, result: parsed
  });

  return NextResponse.json({ remaining: creditResult.remaining, analysis: parsed });
}
