(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/felt-it-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeltItButton",
    ()=>FeltItButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FeltItButton({ answerId, count, onFeel, className = "mt-6" }) {
    _s();
    const [hasFelt, setHasFelt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFeeling, setIsFeeling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const storageKey = `unmute_felt_${answerId}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeltItButton.useEffect": ()=>{
            setHasFelt(localStorage.getItem(storageKey) === "true");
        }
    }["FeltItButton.useEffect"], [
        storageKey
    ]);
    const handleFeel = async ()=>{
        if (isFeeling) return;
        const nextHasFelt = !hasFelt;
        setIsFeeling(true);
        if (nextHasFelt) {
            localStorage.setItem(storageKey, "true");
        } else {
            localStorage.removeItem(storageKey);
        }
        setHasFelt(nextHasFelt);
        try {
            await onFeel(nextHasFelt);
        } catch  {
            if (hasFelt) {
                localStorage.setItem(storageKey, "true");
            } else {
                localStorage.removeItem(storageKey);
            }
            setHasFelt(hasFelt);
        }
        setIsFeeling(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-wrap items-center gap-3 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                whileTap: {
                    scale: 0.96
                },
                animate: hasFelt ? {
                    scale: [
                        1,
                        1.04,
                        1
                    ]
                } : {
                    scale: 1
                },
                transition: {
                    duration: 0.45
                },
                onClick: handleFeel,
                disabled: isFeeling,
                className: `
          inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition
          ${hasFelt ? "animate-[feltPulse_0.5s_ease]" : ""}
          ${hasFelt ? "border-amber-200/40 bg-amber-300/10 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.12)]" : "border-border bg-background/40 text-muted-foreground hover:border-amber-200/30 hover:text-amber-100"}
          disabled:cursor-default
        `,
                "aria-label": hasFelt ? "You felt this too" : "Felt it",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: hasFelt ? "animate-pulse" : "",
                        children: "🫀"
                    }, void 0, false, {
                        fileName: "[project]/components/felt-it-button.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: hasFelt ? "You felt this too" : "Felt it"
                    }, void 0, false, {
                        fileName: "[project]/components/felt-it-button.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/felt-it-button.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-muted-foreground",
                children: [
                    count,
                    " ",
                    count === 1 ? "felt this" : "felt this"
                ]
            }, void 0, true, {
                fileName: "[project]/components/felt-it-button.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/felt-it-button.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(FeltItButton, "YY77m8g0+3VIrhxMOPzEP26QljQ=");
_c = FeltItButton;
var _c;
__turbopack_context__.k.register(_c, "FeltItButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/theme-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeToggle() {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeToggle.useEffect": ()=>{
            setMounted(true);
        }
    }["ThemeToggle.useEffect"], []);
    const isDark = mounted ? resolvedTheme !== "light" : true;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: ()=>setTheme(isDark ? "light" : "dark"),
        className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:bg-secondary hover:text-foreground",
        "aria-label": isDark ? "Switch to light theme" : "Switch to dark theme",
        title: isDark ? "Light theme" : "Dark theme",
        children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            className: "h-4 w-4",
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 26,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            className: "h-4 w-4",
            "aria-hidden": "true"
        }, void 0, false, {
            fileName: "[project]/components/theme-toggle.tsx",
            lineNumber: 28,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/theme-toggle.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "snWFY29FHgjAZ2wIgWtFWjmF+Ok=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/anonymous-id.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOrCreateAnonymousId",
    ()=>getOrCreateAnonymousId
]);
"use client";
const STORAGE_KEY = "unmute_anonymous_id";
const ECHO_STORAGE_KEY = "unmute_anon_id";
function getOrCreateAnonymousId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const existingId = localStorage.getItem(ECHO_STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (existingId) return existingId;
    const newId = `anon_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(ECHO_STORAGE_KEY, newId);
    return newId;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/daily-questions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
function createClient() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://iqblmcshkndxjnduacxt.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxYmxtY3Noa25keGpuZHVhY3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDI3MDAsImV4cCI6MjA4NTQxODcwMH0.tsr1erIEKdkvYFH5R8L6AkfaLfY5YoGMFt8UUwyUskY"));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/echoes-wall.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EchoesWall",
    ()=>EchoesWall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$felt$2d$it$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/felt-it-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$anonymous$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/anonymous-id.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/daily-questions.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function timeAgo(value) {
    const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return "today";
}
function EchoesWall() {
    _s();
    const [anonymousId, setAnonymousId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [question, setQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [questionDate, setQuestionDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [questionIndex, setQuestionIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [answerText, setAnswerText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [hasAnsweredToday, setHasAnsweredToday] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmingDeleteId, setConfirmingDeleteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deletingIds, setDeletingIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isPosting, setIsPosting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wallRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EchoesWall.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["EchoesWall.useMemo[supabase]"], []);
    const loadEchoes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EchoesWall.useCallback[loadEchoes]": async ()=>{
            const response = await fetch("/api/echoes");
            const data = await response.json();
            if (response.ok) {
                setQuestion(data.question);
                setQuestionDate(data.questionDate);
                setQuestionIndex(data.questionIndex);
                setAnswers(data.answers || []);
            } else {
                setMessage(data.error || "Echoes are quiet right now.");
            }
            setIsLoading(false);
        }
    }["EchoesWall.useCallback[loadEchoes]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EchoesWall.useEffect": ()=>{
            const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$anonymous$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOrCreateAnonymousId"])();
            const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocalDateKey"])();
            setAnonymousId(id);
            setHasAnsweredToday(localStorage.getItem(`unmute_echoed_${today}`) === "true");
            loadEchoes();
        }
    }["EchoesWall.useEffect"], [
        loadEchoes
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EchoesWall.useEffect": ()=>{
            if (questionIndex === null || !questionDate) return;
            const channel = supabase.channel(`echoes:${questionDate}`).on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "echo_answers",
                filter: "feature=eq.echo"
            }, {
                "EchoesWall.useEffect.channel": (payload)=>{
                    const newAnswer = payload.new;
                    if (newAnswer.question_index !== questionIndex) return;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocalDateKey"])(new Date(newAnswer.created_at)) !== questionDate) return;
                    setAnswers({
                        "EchoesWall.useEffect.channel": (current)=>{
                            if (current.some({
                                "EchoesWall.useEffect.channel": (answer)=>answer.id === newAnswer.id
                            }["EchoesWall.useEffect.channel"])) return current;
                            return [
                                newAnswer,
                                ...current
                            ];
                        }
                    }["EchoesWall.useEffect.channel"]);
                }
            }["EchoesWall.useEffect.channel"]).on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "echo_answers",
                filter: "feature=eq.echo"
            }, {
                "EchoesWall.useEffect.channel": (payload)=>{
                    const updatedAnswer = payload.new;
                    if (updatedAnswer.question_index !== questionIndex) return;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$daily$2d$questions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocalDateKey"])(new Date(updatedAnswer.created_at)) !== questionDate) return;
                    setAnswers({
                        "EchoesWall.useEffect.channel": (current)=>current.map({
                                "EchoesWall.useEffect.channel": (answer)=>answer.id === updatedAnswer.id ? updatedAnswer : answer
                            }["EchoesWall.useEffect.channel"])
                    }["EchoesWall.useEffect.channel"]);
                }
            }["EchoesWall.useEffect.channel"]).on("postgres_changes", {
                event: "DELETE",
                schema: "public",
                table: "echo_answers",
                filter: "feature=eq.echo"
            }, {
                "EchoesWall.useEffect.channel": (payload)=>{
                    const oldAnswer = payload.old;
                    setAnswers({
                        "EchoesWall.useEffect.channel": (current)=>current.filter({
                                "EchoesWall.useEffect.channel": (answer)=>answer.id !== oldAnswer.id
                            }["EchoesWall.useEffect.channel"])
                    }["EchoesWall.useEffect.channel"]);
                }
            }["EchoesWall.useEffect.channel"]).subscribe();
            return ({
                "EchoesWall.useEffect": ()=>{
                    supabase.removeChannel(channel);
                }
            })["EchoesWall.useEffect"];
        }
    }["EchoesWall.useEffect"], [
        questionDate,
        questionIndex,
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EchoesWall.useEffect": ()=>{
            if (!message) return;
            const timeout = window.setTimeout({
                "EchoesWall.useEffect.timeout": ()=>setMessage("")
            }["EchoesWall.useEffect.timeout"], 3000);
            return ({
                "EchoesWall.useEffect": ()=>window.clearTimeout(timeout)
            })["EchoesWall.useEffect"];
        }
    }["EchoesWall.useEffect"], [
        message
    ]);
    const scrollToWall = ()=>{
        wallRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };
    const handlePost = async (event)=>{
        event.preventDefault();
        const trimmedAnswer = answerText.replace(/\s+/g, " ").trim();
        if (!trimmedAnswer || isPosting || hasAnsweredToday) return;
        setIsPosting(true);
        const response = await fetch("/api/echoes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                anonymousId,
                answerText: trimmedAnswer
            })
        });
        const data = await response.json();
        setIsPosting(false);
        if (!response.ok) {
            setMessage(data.error || "Your Echo could not be released.");
            return;
        }
        localStorage.setItem(`unmute_echoed_${data.questionDate}`, "true");
        setHasAnsweredToday(true);
        setAnswerText("");
        setAnswers((current)=>{
            if (current.some((answer)=>answer.id === data.answer.id)) return current;
            return [
                data.answer,
                ...current
            ];
        });
        window.setTimeout(scrollToWall, 120);
    };
    const handleFeel = async (answer, nextHasFelt)=>{
        const delta = nextHasFelt ? 1 : -1;
        setAnswers((current)=>current.map((item)=>item.id === answer.id ? {
                    ...item,
                    felt_count: Math.max((item.felt_count || 0) + delta, 0)
                } : item));
        const response = await fetch("/api/echoes/resonate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answerId: answer.id,
                anonymousId
            })
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || "That feeling did not save.");
            await loadEchoes();
            throw new Error(data.error || "Felt it failed");
        }
        const nextCount = data?.answer?.felt_count;
        if (typeof nextCount === "number") {
            setAnswers((current)=>current.map((item)=>item.id === answer.id ? {
                        ...item,
                        felt_count: nextCount
                    } : item));
        }
    };
    const handleDelete = async (answer)=>{
        setDeletingIds((current)=>new Set(current).add(answer.id));
        const response = await fetch("/api/echoes", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answerId: answer.id,
                anonymousId
            })
        });
        const data = await response.json();
        if (!response.ok) {
            setDeletingIds((current)=>{
                const next = new Set(current);
                next.delete(answer.id);
                return next;
            });
            setMessage(data.error || "Your Echo could not be removed.");
            return;
        }
        setConfirmingDeleteId(null);
        setAnswers((current)=>current.filter((item)=>item.id !== answer.id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-439795b7717ff491" + " " + "relative min-h-screen overflow-hidden bg-background text-foreground",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute -left-20 -top-24 z-0 h-[350px] w-[350px] rounded-full bg-[rgba(139,92,246,0.14)] blur-[70px] animate-[drift_14s_ease-in-out_infinite] dark:bg-[rgba(139,92,246,0.07)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute -right-16 top-[120px] z-0 h-[280px] w-[280px] rounded-full bg-[rgba(251,146,60,0.12)] blur-[60px] animate-[drift_14s_ease-in-out_infinite] [animation-delay:-4s] dark:bg-[rgba(251,146,60,0.05)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute bottom-20 left-[35%] z-0 h-[220px] w-[220px] rounded-full bg-[rgba(99,179,237,0.1)] blur-[50px] animate-[drift_14s_ease-in-out_infinite] [animation-delay:-8s] dark:bg-[rgba(99,179,237,0.04)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute left-[15%] top-[20%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute left-[78%] top-[45%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-0.8s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute left-[42%] top-[68%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-1.6s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-439795b7717ff491" + " " + "pointer-events-none absolute left-[22%] top-[82%] z-[1] h-1.5 w-1.5 rounded-full bg-[rgba(251,146,60,0.75)] shadow-[0_0_14px_rgba(251,146,60,0.45)] animate-[shimmer_3s_ease-in-out_infinite] [animation-delay:-2.4s] dark:h-1 dark:w-1 dark:bg-[rgba(251,146,60,0.5)]"
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-439795b7717ff491" + " " + "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-439795b7717ff491" + " " + "container relative z-20 mx-auto flex items-center justify-between px-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition hover:text-foreground",
                            "aria-label": "Return home",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/echoes-wall.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "jsx-439795b7717ff491" + " " + "text-sm font-medium tracking-[0.3em] text-muted-foreground",
                            children: "ECHOES"
                        }, void 0, false, {
                            fileName: "[project]/components/echoes-wall.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-439795b7717ff491" + " " + "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-439795b7717ff491" + " " + "flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-439795b7717ff491" + " " + "h-1.5 w-1.5 rounded-full bg-[#4ade80] animate-[livePulse_2s_ease-in-out_infinite]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/echoes-wall.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-439795b7717ff491" + " " + "text-[11px] lowercase text-muted-foreground dark:text-[rgba(255,255,255,0.3)]",
                                            children: "live"
                                        }, void 0, false, {
                                            fileName: "[project]/components/echoes-wall.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/echoes-wall.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                    fileName: "[project]/components/echoes-wall.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/echoes-wall.tsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/echoes-wall.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-439795b7717ff491" + " " + "container relative z-10 mx-auto px-4 pb-12 pt-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-439795b7717ff491" + " " + "mx-auto max-w-[600px] text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "question-label mx-auto mb-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground dark:text-[rgba(255,255,255,0.25)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-439795b7717ff491" + " " + "h-px w-10 bg-current opacity-30"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 266,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-439795b7717ff491",
                                        children: "today's question"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-439795b7717ff491" + " " + "h-px w-10 bg-current opacity-30"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                                initial: {
                                    opacity: 0,
                                    y: 14
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                className: "text-2xl font-light leading-[1.4] text-foreground/85 sm:text-[36px]",
                                children: question || "Loading today's question..."
                            }, void 0, false, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-439795b7717ff491" + " " + "mt-5 text-[13px] text-muted-foreground",
                                children: [
                                    answers.length,
                                    " ",
                                    answers.length === 1 ? "person spoke" : "people spoke",
                                    " today"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "mx-auto mt-9 max-w-2xl",
                                children: hasAnsweredToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: scrollToWall,
                                    className: "jsx-439795b7717ff491" + " " + "rounded-full border border-border bg-secondary/60 px-5 py-3 text-sm text-foreground/80 transition hover:bg-secondary",
                                    children: "See what someone like you said →"
                                }, void 0, false, {
                                    fileName: "[project]/components/echoes-wall.tsx",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handlePost,
                                    className: "jsx-439795b7717ff491" + " " + "rounded-2xl border border-border bg-card/50 p-4 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: answerText,
                                            onChange: (event)=>setAnswerText(event.target.value),
                                            maxLength: 180,
                                            rows: 4,
                                            placeholder: "Say it here. No one knows it's you.",
                                            "aria-label": "Anonymous Echo answer",
                                            className: "jsx-439795b7717ff491" + " " + "min-h-28 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
                                        }, void 0, false, {
                                            fileName: "[project]/components/echoes-wall.tsx",
                                            lineNumber: 292,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-439795b7717ff491" + " " + "mt-3 flex items-center justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-439795b7717ff491" + " " + "text-xs text-muted-foreground/60",
                                                    children: [
                                                        answerText.length,
                                                        "/180"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/echoes-wall.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "submit",
                                                    disabled: !answerText.trim() || isPosting,
                                                    className: "jsx-439795b7717ff491" + " " + "shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
                                                    children: isPosting ? "Releasing..." : "Release it"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/echoes-wall.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/echoes-wall.tsx",
                                            lineNumber: 301,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/echoes-wall.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/echoes-wall.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-439795b7717ff491" + " " + "mb-0 mt-12 h-px bg-border/70"
                    }, void 0, false, {
                        fileName: "[project]/components/echoes-wall.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: wallRef,
                        className: "jsx-439795b7717ff491" + " " + "mt-12 scroll-mt-24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "mb-4 flex items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-439795b7717ff491" + " " + "text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground",
                                        children: "Today's Wall"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-439795b7717ff491" + " " + `text-[11px] tracking-[0.15em] ${answers.length > 0 ? "text-amber-500" : "text-muted-foreground"}`,
                                        children: [
                                            "↑ ",
                                            answers.length,
                                            " echoes today"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "mb-8 h-px bg-border/60"
                            }, void 0, false, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 animate-spin",
                                        "aria-hidden": "true"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    "Gathering today's Echoes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this) : answers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-439795b7717ff491" + " " + "flex flex-col items-center justify-center gap-4 py-24 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-439795b7717ff491" + " " + "h-2.5 w-2.5 rounded-full bg-amber-200/70 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-439795b7717ff491" + " " + "text-sm text-muted-foreground",
                                        children: "The wall is silent. Be the first to speak."
                                    }, void 0, false, {
                                        fileName: "[project]/components/echoes-wall.tsx",
                                        lineNumber: 335,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: answers.length < 3 ? {
                                    maxWidth: "480px",
                                    margin: "0 auto",
                                    padding: "0 16px"
                                } : {
                                    columns: "3 280px",
                                    columnGap: "16px",
                                    padding: "0 16px"
                                },
                                className: "jsx-439795b7717ff491",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    initial: false,
                                    children: answers.map((answer, index)=>{
                                        const isMine = answer.anonymous_user_id === anonymousId;
                                        const isConfirming = confirmingDeleteId === answer.id;
                                        const isDeleting = deletingIds.has(answer.id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].article, {
                                            layout: true,
                                            initial: {
                                                opacity: 0,
                                                y: 18
                                            },
                                            animate: {
                                                opacity: isDeleting ? 0 : 1,
                                                y: 0,
                                                height: "auto"
                                            },
                                            exit: {
                                                opacity: 0,
                                                y: 12,
                                                height: 0,
                                                marginBottom: 0
                                            },
                                            transition: {
                                                delay: Math.min(index * 0.05, 0.45),
                                                duration: 0.28
                                            },
                                            className: "relative z-10 border bg-card transition-all duration-200 ease-out hover:border-[rgba(255,180,50,0.2)] hover:shadow-[0_0_20px_rgba(255,180,50,0.05)] dark:bg-[#111111]",
                                            style: {
                                                breakInside: "avoid",
                                                marginBottom: "16px",
                                                display: "inline-block",
                                                width: "100%",
                                                borderRadius: "16px",
                                                padding: "20px",
                                                minHeight: "120px",
                                                animation: "floatUp 0.6s ease both",
                                                animationDelay: `${index * 0.07}s`
                                            },
                                            children: [
                                                isMine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-439795b7717ff491" + " " + "absolute right-3 top-3",
                                                    children: isConfirming ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-439795b7717ff491" + " " + "rounded-xl border border-border bg-background/95 p-3 text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-439795b7717ff491" + " " + "mb-2 text-xs text-muted-foreground",
                                                                children: "Remove your echo?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/echoes-wall.tsx",
                                                                lineNumber: 376,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-439795b7717ff491" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleDelete(answer),
                                                                        disabled: isDeleting,
                                                                        className: "jsx-439795b7717ff491" + " " + "rounded-full bg-foreground px-3 py-1 text-xs text-background disabled:opacity-50",
                                                                        children: "Yes"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/echoes-wall.tsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setConfirmingDeleteId(null),
                                                                        className: "jsx-439795b7717ff491" + " " + "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground",
                                                                        children: "Cancel"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/echoes-wall.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/echoes-wall.tsx",
                                                                lineNumber: 377,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/echoes-wall.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 29
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setConfirmingDeleteId(answer.id),
                                                        "aria-label": "Delete your Echo",
                                                        className: "jsx-439795b7717ff491" + " " + "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/60 transition hover:bg-secondary hover:text-foreground",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            className: "h-4 w-4",
                                                            "aria-hidden": "true"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/echoes-wall.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/echoes-wall.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/echoes-wall.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-439795b7717ff491" + " " + `font-light leading-relaxed text-foreground ${isMine ? "pr-10" : ""} ${answer.answer_text.length < 80 ? "text-xl" : "text-base"}`,
                                                    children: answer.answer_text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/echoes-wall.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-439795b7717ff491" + " " + "mt-8 flex items-end justify-between gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$felt$2d$it$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeltItButton"], {
                                                            answerId: answer.id,
                                                            count: answer.felt_count || 0,
                                                            onFeel: (nextHasFelt)=>handleFeel(answer, nextHasFelt),
                                                            className: "mt-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/echoes-wall.tsx",
                                                            lineNumber: 412,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-439795b7717ff491" + " " + "shrink-0 text-[11px] text-muted-foreground/70",
                                                            children: timeAgo(answer.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/echoes-wall.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/echoes-wall.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, answer.id, true, {
                                            fileName: "[project]/components/echoes-wall.tsx",
                                            lineNumber: 352,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/echoes-wall.tsx",
                                    lineNumber: 345,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/echoes-wall.tsx",
                                lineNumber: 338,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/echoes-wall.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 18
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 18
                    },
                    className: "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground",
                    role: "status",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/components/echoes-wall.tsx",
                    lineNumber: 431,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/echoes-wall.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "439795b7717ff491",
                children: "@keyframes drift{0%,to{transform:translateY(0)translate(0)}33%{transform:translateY(-10px)translate(5px)}66%{transform:translateY(5px)translate(-8px)}}@keyframes livePulse{0%,to{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}@keyframes floatUp{0%{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes feltPulse{0%{box-shadow:0 0 #fb923c99}70%{box-shadow:0 0 0 10px #fb923c00}to{box-shadow:0 0 #fb923c00}}@keyframes shimmer{0%,to{opacity:.2}50%{opacity:.6}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/echoes-wall.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
_s(EchoesWall, "Ke5mm/QK6j1iuHQQht4LVOYOXRY=");
_c = EchoesWall;
var _c;
__turbopack_context__.k.register(_c, "EchoesWall");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_11d32256._.js.map