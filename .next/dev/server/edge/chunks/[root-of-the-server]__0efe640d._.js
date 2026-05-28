(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__0efe640d._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/daily-questions.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DAILY_ECHO_QUESTIONS",
    ()=>DAILY_ECHO_QUESTIONS,
    "extractResonanceWords",
    ()=>extractResonanceWords,
    "getDailyQuestion",
    ()=>getDailyQuestion,
    "getUtcDateKey",
    ()=>getUtcDateKey
]);
const DAILY_ECHO_QUESTIONS = [
    "What are you pretending is fine right now?",
    "What did you need to hear today?",
    "What feeling has been sitting quietly with you?",
    "What are you carrying that no one can see?",
    "What would feel lighter if you said it out loud?",
    "Where do you wish someone understood you better?",
    "What part of today felt heavier than expected?",
    "What truth are you making room for?",
    "What are you hoping tomorrow is kinder about?",
    "What are you tired of explaining?"
];
const MS_PER_DAY = 24 * 60 * 60 * 1000;
function getUtcDateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}
function getDailyQuestion(date = new Date()) {
    const dayIndex = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY);
    return DAILY_ECHO_QUESTIONS[dayIndex % DAILY_ECHO_QUESTIONS.length];
}
function extractResonanceWords(text, fallback = "quiet, present, human") {
    const stopWords = new Set([
        "about",
        "after",
        "again",
        "also",
        "because",
        "being",
        "could",
        "every",
        "feels",
        "from",
        "have",
        "just",
        "like",
        "more",
        "need",
        "really",
        "still",
        "that",
        "their",
        "there",
        "this",
        "today",
        "want",
        "with",
        "would",
        "your"
    ]);
    const words = text.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).map((word)=>word.trim()).filter((word)=>word.length > 3 && !stopWords.has(word));
    const uniqueWords = Array.from(new Set(words)).slice(0, 3);
    if (uniqueWords.length >= 3) return uniqueWords.join(", ");
    return [
        ...uniqueWords,
        ...fallback.split(", ").filter((word)=>!uniqueWords.includes(word))
    ].slice(0, 3).join(", ");
}
}),
"[project]/lib/supabase/server.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$105$2e$1$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.105.1/node_modules/@supabase/ssr/dist/module/index.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$105$2e$1$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.105.1/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/headers.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/request/cookies.js [app-edge-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$105$2e$1$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://iqblmcshkndxjnduacxt.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxYmxtY3Noa25keGpuZHVhY3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDI3MDAsImV4cCI6MjA4NTQxODcwMH0.tsr1erIEKdkvYFH5R8L6AkfaLfY5YoGMFt8UUwyUskY"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The "setAll" method was called from a Server Component.
                // This can be ignored if you have middleware refreshing user sessions.
                }
            }
        }
    });
}
}),
"[project]/app/api/twin/candidates/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/daily-questions.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/api/server.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/esm/server/web/exports/index.js [app-edge-route] (ecmascript)");
;
;
;
const runtime = "edge";
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get("anonymousId");
    const questionDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getUtcDateKey"])();
    if (!anonymousId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Anonymous ID is required"
        }, {
            status: 400
        });
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: candidates, error } = await supabase.from("twin_intents").select("id, anonymous_id, words, source_type, created_at").eq("question_date", questionDate).neq("anonymous_id", anonymousId).gt("expires_at", new Date().toISOString()).order("created_at", {
        ascending: false
    }).limit(3);
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        candidates: candidates || [],
        questionDate
    });
}
async function POST(request) {
    const body = await request.json();
    const anonymousId = String(body.anonymousId || "").trim();
    const sourceType = String(body.sourceType || "session");
    const sourceId = body.sourceId ? String(body.sourceId).trim() : null;
    const textSeed = String(body.textSeed || body.emotion || "quiet present human").trim();
    if (!anonymousId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Anonymous ID is required"
        }, {
            status: 400
        });
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const questionDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getUtcDateKey"])();
    const { data: intent, error } = await supabase.from("twin_intents").upsert({
        anonymous_id: anonymousId,
        source_type: sourceType,
        source_id: sourceId,
        question_date: questionDate,
        words: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["extractResonanceWords"])(textSeed),
        text_seed: textSeed,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }, {
        onConflict: "anonymous_id,question_date"
    }).select().single();
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        intent
    });
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0efe640d._.js.map