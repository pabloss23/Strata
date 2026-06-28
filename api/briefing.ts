// api/briefing.ts — capa de IA ANCLADA (GRATUITA) para Strata Founders.
// Usa Google Gemini (nivel gratuito). La API key vive SOLO en el servidor
// (GEMINI_API_KEY), nunca en el cliente. Despliega en Vercel/Netlify (functions).
//
// Anti-alucinación: el modelo SOLO puede usar los datos que le pasa el cliente
// (ya extraídos de jurisdictions.json, con su año/fuente). Prohibido inventar
// cifras; si falta un dato dice "no disponible"; cierra siempre recordando que no
// es asesoramiento y que el CFC depende de la nacionalidad/residencia.
//
// En desarrollo local (vite sin función) el cliente cae al briefing DETERMINISTA
// automáticamente, así que la web nunca depende de la IA para funcionar.

interface Pick {
  name: string;
  score: number;
  corporateRate?: string;
  personalRate?: string;
  system?: string;
  cfcNote?: string;
  cfcWarning?: boolean;
  status?: string;
  lastVerified?: string;
}
interface Payload {
  lang?: "es" | "ca" | "en";
  business?: string;
  clients?: string;
  nationality?: string;
  picks?: Pick[];
}

const LANG_NAME: Record<string, string> = { es: "español", ca: "valenciano", en: "English" };

const SYSTEM = `Eres un analista de jurisdicciones para fundadores. Reglas estrictas:
- Usa EXCLUSIVAMENTE los datos numéricos y notas proporcionados. PROHIBIDO inventar o estimar cifras.
- Si un dato no está, escribe "no disponible". Nunca rellenes huecos.
- Optimización legal, jamás evasión. No diseñes estructuras concretas para "pagar cero".
- Tono educativo y honesto. Cierra recordando que no es asesoramiento y que el CFC depende de la nacionalidad/residencia del usuario.`;

function buildPrompt(p: Payload): string {
  const lines = (p.picks ?? [])
    .map(
      (j, i) =>
        `${i + 1}. ${j.name} (encaje ${j.score}/100, estado ${j.status ?? "?"}, verificado ${j.lastVerified ?? "?"}): ` +
        `sociedades ${j.corporateRate ?? "no disponible"}; IRPF ${j.personalRate ?? "no disponible"}; ` +
        `sistema ${j.system ?? "no disponible"}; CFC ${j.cfcNote ?? "no disponible"}` +
        `${j.cfcWarning ? " [AVISO CFC para esta nacionalidad]" : ""}.`
    )
    .join("\n");
  return [
    `Perfil del fundador: negocio=${p.business}, clientes=${p.clients}, nacionalidad=${p.nationality}.`,
    `Jurisdicciones (ÚNICA fuente de datos permitida; no uses conocimiento externo para cifras):`,
    lines || "(sin datos)",
    ``,
    `Escribe un briefing claro y útil (máx. 220 palabras) que: (1) resuma por qué encajan las mejores; (2) use SOLO las cifras de arriba, citándolas; (3) si hay AVISO CFC, explíquelo; (4) recuerde revisar establecimiento permanente, sustancia y residencia personal; (5) cierre con el aviso de que no es asesoramiento.`,
  ].join("\n");
}

export default async function handler(req: any, res: any) {
  // Soporta tanto el estilo Node (req,res de Vercel) como Web (Request→Response).
  const isNode = res && typeof res.status === "function";
  const send = (code: number, obj: unknown) =>
    isNode
      ? res.status(code).json(obj)
      : new Response(JSON.stringify(obj), { status: code, headers: { "content-type": "application/json" } });

  const method = isNode ? req.method : (req as Request).method;
  if (method !== "POST") return send(405, { error: "method_not_allowed" });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return send(501, { error: "no_ai", message: "GEMINI_API_KEY no configurada; usa el briefing determinista." });

  try {
    const payload: Payload = isNode
      ? typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body
      : await (req as Request).json();

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const lang = LANG_NAME[payload.lang ?? "es"] ?? "español";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: `${SYSTEM}\nResponde en ${lang}.` }] },
        contents: [{ role: "user", parts: [{ text: buildPrompt(payload) }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
    });
    if (!r.ok) return send(502, { error: "ai_upstream", detail: (await r.text()).slice(0, 400) });

    const data: any = await r.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.map((x: any) => x.text).join("") ?? "";
    if (!text) return send(502, { error: "empty" });
    return send(200, { text });
  } catch (e: any) {
    return send(500, { error: "server", detail: String(e?.message ?? e) });
  }
}
