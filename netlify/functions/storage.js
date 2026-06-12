import { getStore } from "@netlify/blobs";

// Simple shared key-value storage for VoteKSB.
// GET  /.netlify/functions/storage?key=voteksb:tallies  -> { value }
// POST /.netlify/functions/storage  { key, value }       -> { ok: true }
//
// Values are stored as plain strings (the app stores JSON-stringified data).

export default async (req) => {
  const store = getStore("voteksb");
  const url = new URL(req.url);

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing key" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    const value = await store.get(key);
    return new Response(JSON.stringify({ value: value ?? null }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    const { key, value } = body || {};
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing key" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    await store.set(key, String(value ?? ""));
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: cors });
};

export const config = {
  path: "/.netlify/functions/storage",
};
