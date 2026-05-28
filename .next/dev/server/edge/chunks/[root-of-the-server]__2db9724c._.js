(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2db9724c._.js",
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
    "ECHO_QUESTIONS",
    ()=>ECHO_QUESTIONS,
    "extractResonanceWords",
    ()=>extractResonanceWords,
    "getDayOfYear",
    ()=>getDayOfYear,
    "getLocalDateKey",
    ()=>getLocalDateKey,
    "getQuestionIndex",
    ()=>getQuestionIndex,
    "getTodaysQuestion",
    ()=>getTodaysQuestion
]);
const ECHO_QUESTIONS = [
    "What's the one thing you keep almost saying out loud but swallow every time?",
    "Which version of you did you have to kill to survive this far?",
    "What would you do tomorrow if you knew no one would be disappointed?",
    "When did you last feel genuinely seen not just noticed?",
    "What emotion do you not have a word for but feel almost every day?",
    "Who taught you that asking for help was weakness?",
    "What are you secretly exhausted by that everyone thinks you're fine with?",
    "What part of your life are you living for someone who doesn't even notice?",
    "What do you wish someone had told you during the hardest year of your life?",
    "What feeling do you immediately try to escape the moment it shows up?",
    "What lie do you tell most convincingly to yourself?",
    "What would your body say if it could speak right now?",
    "What's the kindest thing anyone ever said to you that you still don't believe?",
    "What are you most afraid people would find boring about the real you?",
    "What's something you forgave someone for that you never told them you forgave?",
    "When you're alone and quiet, what thought shows up uninvited every time?",
    "What do you pretend not to care about because caring feels too risky?",
    "Who in your life would be shocked by how much you're actually struggling?",
    "What chapter of your life are you still not ready to talk about?",
    "What would you do differently if you weren't afraid of being misunderstood?",
    "What emotion do you only let yourself feel when you're completely alone?",
    "What's the most human thing about you that you try to hide?",
    "Who are you when nobody needs anything from you?",
    "What have you been grieving that nobody knows to comfort you for?",
    "What's the difference between who you are and who you've let people believe you are?",
    "What would feel like relief right now — even if it sounds selfish?",
    "What's the most honest thing you've said to a stranger that you'd never say to someone close?",
    "What are you waiting to feel before you let yourself be happy?",
    "What feeling have you been calling 'fine' for so long you forgot it has another name?",
    "If the version of you from 5 years ago could see you now — what would they feel?"
];
function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
function getQuestionIndex(date = new Date()) {
    return getDayOfYear(date) % ECHO_QUESTIONS.length;
}
function getTodaysQuestion(date = new Date()) {
    return ECHO_QUESTIONS[getQuestionIndex(date)];
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [app-edge-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://iqblmcshkndxjnduacxt.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxYmxtY3Noa25keGpuZHVhY3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDI3MDAsImV4cCI6MjA4NTQxODcwMH0.tsr1erIEKdkvYFH5R8L6AkfaLfY5YoGMFt8UUwyUskY"), {
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
"[project]/app/api/echoes/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/daily-questions.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [app-edge-route] (ecmascript)");
;
;
;
const runtime = "edge";
const MAX_ANSWER_LENGTH = 180;
async function GET() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const now = new Date();
    const questionDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getLocalDateKey"])(now);
    const questionIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getQuestionIndex"])(now);
    const question = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getTodaysQuestion"])(now);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const { data: answers, error } = await supabase.from("echo_answers").select("*").eq("feature", "echo").eq("question_index", questionIndex).gte("created_at", startOfToday.toISOString()).lt("created_at", startOfTomorrow.toISOString()).order("created_at", {
        ascending: false
    });
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        question,
        questionDate,
        questionIndex,
        answers: answers || []
    });
}
async function POST(request) {
    const body = await request.json();
    const anonymousId = String(body.anonymousId || "").trim();
    const answerText = String(body.answerText || "").replace(/\s+/g, " ").trim();
    if (!anonymousId || !answerText) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Anonymous ID and answer are required"
        }, {
            status: 400
        });
    }
    if (answerText.length > MAX_ANSWER_LENGTH) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Keep your Echo under 180 characters"
        }, {
            status: 400
        });
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const now = new Date();
    const questionDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getLocalDateKey"])(now);
    const questionIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getQuestionIndex"])(now);
    const question = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getTodaysQuestion"])(now);
    const { data: answer, error } = await supabase.from("echo_answers").insert({
        anonymous_user_id: anonymousId,
        answer_text: answerText,
        feature: "echo",
        question_index: questionIndex,
        felt_count: 0
    }).select().single();
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        answer,
        question,
        questionDate,
        questionIndex
    });
}
async function DELETE(request) {
    const body = await request.json();
    const answerId = String(body.answerId || "").trim();
    const anonymousId = String(body.anonymousId || "").trim();
    if (!answerId || !anonymousId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Answer ID and anonymous ID are required"
        }, {
            status: 400
        });
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: deleted, error } = await supabase.rpc("delete_echo_answer", {
        answer_id: answerId,
        requester_anonymous_user_id: anonymousId
    });
    if (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
    if (!deleted) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Echo not found or not yours"
        }, {
            status: 403
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true
    });
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__2db9724c._.js.map