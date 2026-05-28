(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-session.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSession",
    ()=>useSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
// Generate a unique anonymous ID for this browser session
function getOrCreateAnonymousId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let anonymousId = sessionStorage.getItem("unmute_anonymous_id");
    if (!anonymousId) {
        anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem("unmute_anonymous_id", anonymousId);
    }
    return anonymousId;
}
function useSession(emotion) {
    _s();
    const [room, setRoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [anonymousId, setAnonymousId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Initialize anonymous ID
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSession.useEffect": ()=>{
            setAnonymousId(getOrCreateAnonymousId());
        }
    }["useSession.useEffect"], []);
    // Join a room and create a session
    const joinRoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSession.useCallback[joinRoom]": async ()=>{
            if (!anonymousId) return;
            if (!emotion || emotion === "undefined") {
                setError("Emotion is required");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Find or create a room
                const roomResponse = await fetch(`/api/rooms?emotion=${emotion}`);
                const roomData = await roomResponse.json();
                if (!roomResponse.ok) {
                    throw new Error(roomData.error || "Failed to find room");
                }
                setRoom(roomData.room);
                // Step 2: Join the room
                await fetch("/api/rooms", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomId: roomData.room.id,
                        action: "join"
                    })
                });
                // Step 3: Create a session
                const sessionResponse = await fetch("/api/sessions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomId: roomData.room.id,
                        anonymousId,
                        emotion
                    })
                });
                const sessionData = await sessionResponse.json();
                if (!sessionResponse.ok) {
                    throw new Error(sessionData.error || "Failed to create session");
                }
                setSession(sessionData.session);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally{
                setIsLoading(false);
            }
        }
    }["useSession.useCallback[joinRoom]"], [
        emotion,
        anonymousId
    ]);
    // Leave the room and end the session
    const leaveRoom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSession.useCallback[leaveRoom]": async (durationSeconds)=>{
            if (!room || !session) return;
            try {
                // End the session
                await fetch("/api/sessions", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId: session.id,
                        durationSeconds
                    })
                });
                // Leave the room
                await fetch("/api/rooms", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomId: room.id,
                        action: "leave"
                    })
                });
            } catch (err) {
                console.error("Error leaving room:", err);
            }
        }
    }["useSession.useCallback[leaveRoom]"], [
        room,
        session
    ]);
    // Send a reaction
    const sendReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSession.useCallback[sendReaction]": async (reactionType)=>{
            if (!room || !session) return;
            try {
                await fetch("/api/reactions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomId: room.id,
                        sessionId: session.id,
                        reactionType
                    })
                });
            } catch (err) {
                console.error("Error sending reaction:", err);
            }
        }
    }["useSession.useCallback[sendReaction]"], [
        room,
        session
    ]);
    // Save reflection
    const saveReflection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSession.useCallback[saveReflection]": async (feelingBefore, feelingAfter, gratitudeNote)=>{
            if (!session) return;
            try {
                await fetch("/api/reflections", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        sessionId: session.id,
                        feelingBefore,
                        feelingAfter,
                        gratitudeNote
                    })
                });
            } catch (err) {
                console.error("Error saving reflection:", err);
            }
        }
    }["useSession.useCallback[saveReflection]"], [
        session
    ]);
    // Auto-join when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSession.useEffect": ()=>{
            if (anonymousId && !room && !session) {
                joinRoom();
            }
        }
    }["useSession.useEffect"], [
        anonymousId,
        room,
        session,
        joinRoom
    ]);
    return {
        room,
        session,
        isLoading,
        error,
        anonymousId,
        joinRoom,
        leaveRoom,
        sendReaction,
        saveReflection
    };
}
_s(useSession, "uxiF6TDIKnAole5tZqmMhWiOzbw=");
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
"[project]/hooks/use-realtime-room.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client"
// import { useEffect, useState, useCallback, useRef } from "react"
// import { createClient } from "@/lib/supabase/client"
// import type { RealtimeChannel } from "@supabase/supabase-js"
// interface Participant {
//   userId: string
//   username: string
//   emoji: string
//   joinedAt: Date
// }
// interface RealtimeReaction {
//   id: string
//   userId: string
//   username?: string
//   emoji?: string
//   type: "heart" | "wave" | "peace"
//   timestamp: number
// }
// const ANIMAL_EMOJIS = ["🐦", "🐱", "🐟", "🐰", "🐿️", "🦊", "🐻", "🐼", "🦁", "🐨"]
// const ANONYMOUS_NAMES = [
//   "Anonymous Bird",
//   "Anonymous Cat", 
//   "Anonymous Fish",
//   "Anonymous Rabbit",
//   "Anonymous Squirrel",
//   "Anonymous Fox",
//   "Anonymous Bear",
//   "Anonymous Panda",
//   "Anonymous Lion",
//   "Anonymous Koala",
// ]
// function getRandomAnimal(userId: string): { emoji: string; name: string } {
//   // Use oderId to consistently assign same animal to same user
//   const index = Math.abs(userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % ANIMAL_EMOJIS.length
//   return {
//     emoji: ANIMAL_EMOJIS[index],
//     name: ANONYMOUS_NAMES[index],
//   }
// }
// export function useRealtimeRoom(roomId: string | null, userId: string) {
//   const [participants, setParticipants] = useState<Participant[]>([])
//   const [reactions, setReactions] = useState<RealtimeReaction[]>([])
//   const [isConnected, setIsConnected] = useState(false)
//   const channelRef = useRef<RealtimeChannel | null>(null)
//   const supabase = createClient()
//   // Generate consistent avatar for this user
//   const myAvatar = getRandomAnimal(userId)
//   useEffect(() => {
//     if (!roomId) return
//     const channelName = `room:${roomId}`
//     // Create the channel with presence tracking
//     const channel = supabase.channel(channelName, {
//       config: {
//         presence: {
//           key: userId,
//         },
//       },
//     })
//     channelRef.current = channel
//     // Handle presence sync - when we first join, get all current participants
//     channel.on("presence", { event: "sync" }, () => {
//       const presenceState = channel.presenceState()
//       const currentParticipants: Participant[] = []
//       for (const key in presenceState) {
//         const presence = presenceState[key]?.[0] as { username: string; emoji: string; joinedAt: string } | undefined
//         if (presence) {
//           currentParticipants.push({
//             userId: key,
//             username: presence.username,
//             emoji: presence.emoji,
//             joinedAt: new Date(presence.joinedAt),
//           })
//         }
//       }
//       setParticipants(currentParticipants)
//     })
//     // Handle when someone joins
//     channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
//       const presence = newPresences[0] as { username: string; emoji: string; joinedAt: string } | undefined
//       if (presence && key) {
//         setParticipants((prev) => {
//           // Check if already exists
//           if (prev.some((p) => p.userId === key)) return prev
//           return [
//             ...prev,
//             {
//               userId: key,
//               username: presence.username,
//               emoji: presence.emoji,
//               joinedAt: new Date(presence.joinedAt),
//             },
//           ]
//         })
//       }
//     })
//     // Handle when someone leaves
//     channel.on("presence", { event: "leave" }, ({ key }) => {
//       if (key) {
//         setParticipants((prev) => prev.filter((p) => p.userId !== key))
//       }
//     })
//     // Handle broadcast reactions
//     channel.on("broadcast", { event: "reaction" }, ({ payload }) => {
//       const reaction = payload as RealtimeReaction
//       setReactions((prev) => [...prev, reaction])
//       // Remove reaction after 2 seconds
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== reaction.id))
//       }, 2000)
//     })
//     // Subscribe and track presence
//     channel.subscribe(async (status) => {
//       if (status === "SUBSCRIBED") {
//         setIsConnected(true)
//         // Track our presence
//         await channel.track({
//           username: myAvatar.name,
//           emoji: myAvatar.emoji,
//           joinedAt: new Date().toISOString(),
//         })
//       }
//     })
//     return () => {
//       channel.unsubscribe()
//       channelRef.current = null
//       setIsConnected(false)
//     }
//   }, [roomId, userId, supabase, myAvatar.name, myAvatar.emoji])
//   // Function to broadcast a reaction
//   const broadcastReaction = useCallback(
//     async (type: "heart" | "wave" | "peace") => {
//       if (!channelRef.current || !isConnected) return
//       const reaction: RealtimeReaction = {
//         id: `${userId}-${Date.now()}`,
//         userId,
//         username: myAvatar.name,
//         emoji: myAvatar.emoji,
//         type,
//         timestamp: Date.now(),
//       }
//       await channelRef.current.send({
//         type: "broadcast",
//         event: "reaction",
//         payload: reaction,
//       })
//     },
//     [userId, isConnected, myAvatar.name, myAvatar.emoji]
//   )
//   return {
//     participants,
//     reactions,
//     isConnected,
//     broadcastReaction,
//     myAvatar,
//     participantCount: participants.length,
//   }
// }old
__turbopack_context__.s([
    "useRealtimeRoom",
    ()=>useRealtimeRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const ANIMAL_EMOJIS = [
    "🐦",
    "🐱",
    "🐟",
    "🐰",
    "🐿️",
    "🦊",
    "🐻",
    "🐼",
    "🦁",
    "🐨"
];
const ANONYMOUS_NAMES = [
    "Anonymous Bird",
    "Anonymous Cat",
    "Anonymous Fish",
    "Anonymous Rabbit",
    "Anonymous Squirrel",
    "Anonymous Fox",
    "Anonymous Bear",
    "Anonymous Panda",
    "Anonymous Lion",
    "Anonymous Koala"
];
function getRandomAnimal(userId) {
    const index = Math.abs(userId.split("").reduce((acc, char)=>acc + char.charCodeAt(0), 0)) % ANIMAL_EMOJIS.length;
    return {
        emoji: ANIMAL_EMOJIS[index],
        name: ANONYMOUS_NAMES[index]
    };
}
function useRealtimeRoom(roomId, userId) {
    _s();
    const [participants, setParticipants] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [reactions, setReactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const channelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // 🔒 DO NOT generate avatar until userId exists
    const myAvatar = userId ? getRandomAnimal(userId) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRealtimeRoom.useEffect": ()=>{
            // 🔴 HARD GUARDS (THIS FIXES "CONNECTING...")
            if (!roomId || !userId || !myAvatar) return;
            setIsConnected(false);
            setParticipants([]);
            const channel = supabase.channel(`room:${roomId}`, {
                config: {
                    presence: {
                        key: userId
                    }
                }
            });
            channelRef.current = channel;
            // Presence sync
            channel.on("presence", {
                event: "sync"
            }, {
                "useRealtimeRoom.useEffect": ()=>{
                    const state = channel.presenceState();
                    const list = [];
                    for(const key in state){
                        const presence = state[key]?.[0];
                        if (presence) {
                            list.push({
                                userId: key,
                                username: presence.username,
                                emoji: presence.emoji,
                                joinedAt: new Date(presence.joinedAt)
                            });
                        }
                    }
                    setParticipants(list);
                }
            }["useRealtimeRoom.useEffect"]);
            // Join
            channel.on("presence", {
                event: "join"
            }, {
                "useRealtimeRoom.useEffect": ({ key, newPresences })=>{
                    const presence = newPresences?.[0];
                    if (!key || !presence) return;
                    setParticipants({
                        "useRealtimeRoom.useEffect": (prev)=>prev.some({
                                "useRealtimeRoom.useEffect": (p)=>p.userId === key
                            }["useRealtimeRoom.useEffect"]) ? prev : [
                                ...prev,
                                {
                                    userId: key,
                                    username: presence.username,
                                    emoji: presence.emoji,
                                    joinedAt: new Date(presence.joinedAt)
                                }
                            ]
                    }["useRealtimeRoom.useEffect"]);
                }
            }["useRealtimeRoom.useEffect"]);
            // Leave
            channel.on("presence", {
                event: "leave"
            }, {
                "useRealtimeRoom.useEffect": ({ key })=>{
                    if (!key) return;
                    setParticipants({
                        "useRealtimeRoom.useEffect": (prev)=>prev.filter({
                                "useRealtimeRoom.useEffect": (p)=>p.userId !== key
                            }["useRealtimeRoom.useEffect"])
                    }["useRealtimeRoom.useEffect"]);
                }
            }["useRealtimeRoom.useEffect"]);
            // Reactions
            channel.on("broadcast", {
                event: "reaction"
            }, {
                "useRealtimeRoom.useEffect": ({ payload })=>{
                    const reaction = payload;
                    setReactions({
                        "useRealtimeRoom.useEffect": (prev)=>[
                                ...prev,
                                reaction
                            ]
                    }["useRealtimeRoom.useEffect"]);
                    setTimeout({
                        "useRealtimeRoom.useEffect": ()=>{
                            setReactions({
                                "useRealtimeRoom.useEffect": (prev)=>prev.filter({
                                        "useRealtimeRoom.useEffect": (r)=>r.id !== reaction.id
                                    }["useRealtimeRoom.useEffect"])
                            }["useRealtimeRoom.useEffect"]);
                        }
                    }["useRealtimeRoom.useEffect"], 2000);
                }
            }["useRealtimeRoom.useEffect"]);
            channel.subscribe({
                "useRealtimeRoom.useEffect": (status)=>{
                    console.log("Realtime status:", status);
                    if (status === "SUBSCRIBED") {
                        setIsConnected(true);
                        channel.track({
                            username: myAvatar.name,
                            emoji: myAvatar.emoji,
                            joinedAt: new Date().toISOString()
                        });
                    }
                }
            }["useRealtimeRoom.useEffect"]);
            return ({
                "useRealtimeRoom.useEffect": ()=>{
                    // ✅ CORRECT CLEANUP (VERY IMPORTANT)
                    supabase.removeChannel(channel);
                    channelRef.current = null;
                    setIsConnected(false);
                }
            })["useRealtimeRoom.useEffect"];
        }
    }["useRealtimeRoom.useEffect"], [
        roomId,
        userId
    ]);
    const broadcastReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useRealtimeRoom.useCallback[broadcastReaction]": async (type)=>{
            if (!channelRef.current || !isConnected || !userId || !myAvatar) return;
            const reaction = {
                id: `${userId}-${Date.now()}`,
                userId,
                username: myAvatar.name,
                emoji: myAvatar.emoji,
                type,
                timestamp: Date.now()
            };
            await channelRef.current.send({
                type: "broadcast",
                event: "reaction",
                payload: reaction
            });
        }
    }["useRealtimeRoom.useCallback[broadcastReaction]"], [
        isConnected,
        userId,
        myAvatar
    ]);
    return {
        participants,
        reactions,
        isConnected,
        broadcastReaction,
        myAvatar,
        participantCount: participants.length
    };
}
_s(useRealtimeRoom, "YgxW+lzHI0QQFg3E17B20+J4n4Q=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-audio-room.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAudioRoom",
    ()=>useAudioRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useAudioRoom(roomName, participantName) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isConnected: false,
        isConnecting: false,
        isMuted: true,
        audioEnabled: false,
        error: null,
        participantAudioLevels: new Map()
    });
    const roomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const connectingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioRoom.useCallback[connect]": async ()=>{
            // Prevent double-connect race condition
            if (connectingRef.current || roomRef.current) return;
            connectingRef.current = true;
            setState({
                "useAudioRoom.useCallback[connect]": (prev)=>({
                        ...prev,
                        isConnecting: true,
                        error: null
                    })
            }["useAudioRoom.useCallback[connect]"]);
            try {
                // Get LiveKit token from our API
                const response = await fetch("/api/livekit/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomName,
                        participantName
                    })
                });
                const data = await response.json();
                // If LiveKit is not configured, gracefully degrade
                if (!data.audioEnabled) {
                    setState({
                        "useAudioRoom.useCallback[connect]": (prev)=>({
                                ...prev,
                                isConnecting: false,
                                audioEnabled: false,
                                error: data.message || "Audio not available"
                            })
                    }["useAudioRoom.useCallback[connect]"]);
                    connectingRef.current = false;
                    return;
                }
                // Dynamic import LiveKit client
                const { Room, RoomEvent, Track } = await __turbopack_context__.A("[project]/node_modules/livekit-client/dist/livekit-client.esm.mjs [app-client] (ecmascript, async loader)");
                const room = new Room({
                    adaptiveStream: true,
                    dynacast: true,
                    audioCaptureDefaults: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                // Set up event listeners BEFORE connecting
                room.on(RoomEvent.Connected, {
                    "useAudioRoom.useCallback[connect]": ()=>{
                        setState({
                            "useAudioRoom.useCallback[connect]": (prev)=>({
                                    ...prev,
                                    isConnected: true,
                                    isConnecting: false,
                                    audioEnabled: true
                                })
                        }["useAudioRoom.useCallback[connect]"]);
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.Disconnected, {
                    "useAudioRoom.useCallback[connect]": ()=>{
                        roomRef.current = null;
                        connectingRef.current = false;
                        setState({
                            "useAudioRoom.useCallback[connect]": (prev)=>({
                                    ...prev,
                                    isConnected: false,
                                    isConnecting: false,
                                    audioEnabled: false,
                                    isMuted: true
                                })
                        }["useAudioRoom.useCallback[connect]"]);
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.TrackSubscribed, {
                    "useAudioRoom.useCallback[connect]": (track, publication, participant)=>{
                        if (track.kind === Track.Kind.Audio) {
                            const audioElement = track.attach();
                            document.body.appendChild(audioElement);
                        }
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.TrackUnsubscribed, {
                    "useAudioRoom.useCallback[connect]": (track)=>{
                        track.detach().forEach({
                            "useAudioRoom.useCallback[connect]": (el)=>el.remove()
                        }["useAudioRoom.useCallback[connect]"]);
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.ActiveSpeakersChanged, {
                    "useAudioRoom.useCallback[connect]": (speakers)=>{
                        const levels = new Map();
                        speakers.forEach({
                            "useAudioRoom.useCallback[connect]": (speaker)=>{
                                levels.set(speaker.identity, speaker.audioLevel || 0);
                            }
                        }["useAudioRoom.useCallback[connect]"]);
                        setState({
                            "useAudioRoom.useCallback[connect]": (prev)=>({
                                    ...prev,
                                    participantAudioLevels: levels
                                })
                        }["useAudioRoom.useCallback[connect]"]);
                    }
                }["useAudioRoom.useCallback[connect]"]);
                // Handle local track mute/unmute events to keep state in sync
                room.on(RoomEvent.LocalTrackPublished, {
                    "useAudioRoom.useCallback[connect]": ()=>{
                        setState({
                            "useAudioRoom.useCallback[connect]": (prev)=>({
                                    ...prev,
                                    isMuted: false
                                })
                        }["useAudioRoom.useCallback[connect]"]);
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.TrackMuted, {
                    "useAudioRoom.useCallback[connect]": (publication, participant)=>{
                        if (participant.isLocal && publication.source === Track.Source.Microphone) {
                            setState({
                                "useAudioRoom.useCallback[connect]": (prev)=>({
                                        ...prev,
                                        isMuted: true
                                    })
                            }["useAudioRoom.useCallback[connect]"]);
                        }
                    }
                }["useAudioRoom.useCallback[connect]"]);
                room.on(RoomEvent.TrackUnmuted, {
                    "useAudioRoom.useCallback[connect]": (publication, participant)=>{
                        if (participant.isLocal && publication.source === Track.Source.Microphone) {
                            setState({
                                "useAudioRoom.useCallback[connect]": (prev)=>({
                                        ...prev,
                                        isMuted: false
                                    })
                            }["useAudioRoom.useCallback[connect]"]);
                        }
                    }
                }["useAudioRoom.useCallback[connect]"]);
                // Connect to room
                await room.connect(data.wsUrl, data.token);
                roomRef.current = room;
                // Start with microphone muted (use LiveKit's built-in mic management)
                await room.localParticipant.setMicrophoneEnabled(false);
                connectingRef.current = false;
            } catch (error) {
                console.error("Failed to connect to audio room:", error);
                connectingRef.current = false;
                setState({
                    "useAudioRoom.useCallback[connect]": (prev)=>({
                            ...prev,
                            isConnecting: false,
                            error: "Failed to connect to audio room"
                        })
                }["useAudioRoom.useCallback[connect]"]);
            }
        }
    }["useAudioRoom.useCallback[connect]"], [
        roomName,
        participantName
    ]);
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioRoom.useCallback[disconnect]": ()=>{
            if (roomRef.current) {
                roomRef.current.disconnect();
                roomRef.current = null;
            }
            connectingRef.current = false;
            setState({
                "useAudioRoom.useCallback[disconnect]": (prev)=>({
                        ...prev,
                        isConnected: false,
                        isConnecting: false,
                        audioEnabled: false,
                        isMuted: true
                    })
            }["useAudioRoom.useCallback[disconnect]"]);
        }
    }["useAudioRoom.useCallback[disconnect]"], []);
    // Use LiveKit's setMicrophoneEnabled for proper audio track management
    const toggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioRoom.useCallback[toggleMute]": async ()=>{
            if (!roomRef.current) return;
            const newMuted = !state.isMuted;
            try {
                // LiveKit handles getUserMedia, track publishing, echo cancellation, etc.
                await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuted);
                setState({
                    "useAudioRoom.useCallback[toggleMute]": (prev)=>({
                            ...prev,
                            isMuted: newMuted
                        })
                }["useAudioRoom.useCallback[toggleMute]"]);
            } catch (error) {
                console.error("Failed to toggle mute:", error);
                setState({
                    "useAudioRoom.useCallback[toggleMute]": (prev)=>({
                            ...prev,
                            error: "Microphone permission denied or unavailable"
                        })
                }["useAudioRoom.useCallback[toggleMute]"]);
            }
        }
    }["useAudioRoom.useCallback[toggleMute]"], [
        state.isMuted
    ]);
    const setMuted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAudioRoom.useCallback[setMuted]": async (muted)=>{
            if (!roomRef.current) return;
            try {
                await roomRef.current.localParticipant.setMicrophoneEnabled(!muted);
                setState({
                    "useAudioRoom.useCallback[setMuted]": (prev)=>({
                            ...prev,
                            isMuted: muted
                        })
                }["useAudioRoom.useCallback[setMuted]"]);
            } catch (error) {
                console.error("Failed to set mute:", error);
            }
        }
    }["useAudioRoom.useCallback[setMuted]"], []);
    // Clean up on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAudioRoom.useEffect": ()=>{
            return ({
                "useAudioRoom.useEffect": ()=>{
                    disconnect();
                }
            })["useAudioRoom.useEffect"];
        }
    }["useAudioRoom.useEffect"], [
        disconnect
    ]);
    return {
        ...state,
        connect,
        disconnect,
        toggleMute,
        setMuted
    };
}
_s(useAudioRoom, "Mw8rpfSQg3IphFDRcyvr2lTGjtU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-persistent-timer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePersistentTimer",
    ()=>usePersistentTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function usePersistentTimer({ roomId, emotion, durationSeconds = 14 * 60, onComplete }) {
    _s();
    const [timeRemaining, setTimeRemaining] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(durationSeconds);
    const [isCompleted, setIsCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNewSession, setIsNewSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isResumed, setIsResumed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const broadcastChannelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const storageKey = `unmute-timer-${emotion}-${roomId ?? "pending"}`;
    const channelName = `unmute-timer-${emotion}`;
    const clearSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePersistentTimer.useCallback[clearSession]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            localStorage.removeItem(storageKey);
            const channel = broadcastChannelRef.current;
            if (!channel) return;
            try {
                channel.postMessage({
                    type: "clear"
                });
            } catch  {
            // Channel can be closed during unmount; ignore.
            }
        }
    }["usePersistentTimer.useCallback[clearSession]"], [
        storageKey
    ]);
    // 🔹 Init timer from storage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePersistentTimer.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!roomId) return;
            const stored = localStorage.getItem(storageKey);
            if (!stored) {
                const startTime = Date.now();
                const data = {
                    startTime,
                    duration: durationSeconds
                };
                localStorage.setItem(storageKey, JSON.stringify(data));
                setIsNewSession(true);
                setTimeRemaining(durationSeconds);
                return;
            }
            try {
                const parsed = JSON.parse(stored);
                const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                const remaining = Math.max(parsed.duration - elapsed, 0);
                setIsResumed(true);
                setTimeRemaining(remaining);
                if (remaining <= 0) {
                    setIsCompleted(true);
                    onComplete?.();
                }
            } catch  {
                localStorage.removeItem(storageKey);
            }
        }
    }["usePersistentTimer.useEffect"], [
        roomId,
        storageKey,
        durationSeconds,
        onComplete
    ]);
    // 🔹 Tick every second
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePersistentTimer.useEffect": ()=>{
            if (isCompleted) return;
            intervalRef.current = setInterval({
                "usePersistentTimer.useEffect": ()=>{
                    setTimeRemaining({
                        "usePersistentTimer.useEffect": (prev)=>{
                            if (prev <= 1) {
                                clearInterval(intervalRef.current);
                                setIsCompleted(true);
                                onComplete?.();
                                return 0;
                            }
                            return prev - 1;
                        }
                    }["usePersistentTimer.useEffect"]);
                }
            }["usePersistentTimer.useEffect"], 1000);
            return ({
                "usePersistentTimer.useEffect": ()=>{
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["usePersistentTimer.useEffect"];
        }
    }["usePersistentTimer.useEffect"], [
        isCompleted,
        onComplete
    ]);
    // 🔹 BroadcastChannel (browser-only)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePersistentTimer.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!("BroadcastChannel" in window)) return;
            const channel = new window.BroadcastChannel(channelName);
            broadcastChannelRef.current = channel;
            channel.onmessage = ({
                "usePersistentTimer.useEffect": (event)=>{
                    if (event.data?.type === "clear") {
                        localStorage.removeItem(storageKey);
                        setIsCompleted(true);
                        setTimeRemaining(0);
                    }
                }
            })["usePersistentTimer.useEffect"];
            return ({
                "usePersistentTimer.useEffect": ()=>{
                    channel.close();
                    if (broadcastChannelRef.current === channel) {
                        broadcastChannelRef.current = null;
                    }
                }
            })["usePersistentTimer.useEffect"];
        }
    }["usePersistentTimer.useEffect"], [
        channelName,
        storageKey
    ]);
    const progress = (durationSeconds - timeRemaining) / durationSeconds * 100;
    const isLastTwoMinutes = timeRemaining <= 120 && timeRemaining > 0;
    return {
        timeRemaining,
        progress,
        isNewSession,
        isResumed,
        isCompleted,
        isLastTwoMinutes,
        clearSession
    };
}
_s(usePersistentTimer, "M0T3gF944/KWpMFsyqNmKLBDEuk=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SilentReactionsSimple.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client"
// import { useState, useEffect } from "react"
// interface RealtimeReaction {
//   id: string
//   userId: string
//   username?: string
//   emoji?: string
//   type: "heart" | "wave" | "peace"
//   timestamp: number
// }
// interface SilentReactionsSimpleProps {
//   onSendReaction: (type: "heart" | "wave" | "peace") => Promise<void>
//   realtimeReactions?: RealtimeReaction[]
//   myUserId?: string
// }
// export function SilentReactionsSimple({ onSendReaction, realtimeReactions = [], myUserId }: SilentReactionsSimpleProps) {
//   const [localReactions, setLocalReactions] = useState<Array<{ 
//     id: string
//     type: string
//     isRemote: boolean
//     username?: string
//     userEmoji?: string
//   }>>([])
//   // Handle incoming realtime reactions from other users
//   useEffect(() => {
//     if (realtimeReactions.length > 0) {
//       const latestReaction = realtimeReactions[realtimeReactions.length - 1]
//       // Only show if it's from someone else
//       if (latestReaction.userId === myUserId) return
//       const newReaction = {
//         id: latestReaction.id,
//         type: latestReaction.type,
//         isRemote: true,
//         username: latestReaction.username || "Someone",
//         userEmoji: latestReaction.emoji,
//       }
//       setLocalReactions((prev) => {
//         if (prev.some((r) => r.id === newReaction.id)) return prev
//         return [...prev, newReaction]
//       })
//       setTimeout(() => {
//         setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
//       }, 3000)
//     }
//   }, [realtimeReactions, myUserId])
//   const handleReaction = (type: "heart" | "wave" | "peace") => {
//     const newReaction = {
//       id: `local-${Date.now()}`,
//       type,
//       isRemote: false,
//     }
//     setLocalReactions((prev) => [...prev, newReaction])
//     setTimeout(() => {
//       setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
//     }, 3000)
//     onSendReaction(type)
//   }
//   const reactionButtons = [
//     { type: "heart" as const, emoji: "\uD83E\uDEC2", label: "Sending support", bg: "bg-rose-500/20 border-rose-500/40 hover:bg-rose-500/30" },
//     { type: "wave" as const, emoji: "\uD83D\uDC4B", label: "I'm here with you", bg: "bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30" },
//     { type: "peace" as const, emoji: "\uD83D\uDE4F", label: "Grateful for you", bg: "bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30" },
//   ]
//   return (
//     <>
//       {/* Floating Reactions - Visible at top center of screen */}
//       <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
//         <div className="flex flex-col items-center gap-3">
//           {localReactions.map((reaction) => {
//             const btn = reactionButtons.find((b) => b.type === reaction.type)
//             return (
//               <div
//                 key={reaction.id}
//                 className="animate-reaction-appear flex items-center gap-3 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl px-5 py-3 shadow-xl"
//               >
//                 <span className="text-3xl">{btn?.emoji}</span>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-foreground">{btn?.label}</span>
//                   {reaction.isRemote && reaction.userEmoji ? (
//                     <span className="text-xs text-muted-foreground flex items-center gap-1">
//                       from <span>{reaction.userEmoji}</span> {reaction.username}
//                     </span>
//                   ) : (
//                     <span className="text-xs text-muted-foreground">sent by you</span>
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//       {/* Reaction Buttons - Bottom left with labels */}
//       <div className="fixed bottom-8 left-4 md:left-8 flex flex-col gap-2 z-40">
//         <p className="text-[10px] text-muted-foreground/60 mb-1 uppercase tracking-wider">Send Support</p>
//         {reactionButtons.map((btn) => (
//           <button
//             key={btn.type}
//             onClick={() => handleReaction(btn.type)}
//             className={`
//               group relative flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md
//               transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${btn.bg}
//             `}
//             aria-label={btn.label}
//           >
//             <span className="text-xl">{btn.emoji}</span>
//             <span className="text-xs text-foreground/80 font-medium pr-2">{btn.label}</span>
//           </button>
//         ))}
//       </div>
//       <style jsx>{`
//         @keyframes reaction-appear {
//           0% { 
//             opacity: 0; 
//             transform: translateY(20px) scale(0.8); 
//           }
//           10% { 
//             opacity: 1; 
//             transform: translateY(0) scale(1); 
//           }
//           90% { 
//             opacity: 1; 
//             transform: translateY(0) scale(1); 
//           }
//           100% { 
//             opacity: 0; 
//             transform: translateY(-20px) scale(0.8); 
//           }
//         }
//         .animate-reaction-appear {
//           animation: reaction-appear 3s ease-in-out forwards;
//         }
//       `}</style>
//     </>
//   )
// }
__turbopack_context__.s([
    "SilentReactionsSimple",
    ()=>SilentReactionsSimple
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const REACTIONS = [
    {
        id: "with-you",
        emoji: "🫂",
        label: "I'm with you",
        bg: "bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50"
    },
    {
        id: "holding",
        emoji: "🕯️",
        label: "Holding space",
        bg: "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50"
    },
    {
        id: "thank-you",
        emoji: "💙",
        label: "Thank you for sharing",
        bg: "bg-blue-500/15 border-blue-500/30 hover:bg-blue-500/25 hover:border-blue-500/50"
    },
    {
        id: "take-time",
        emoji: "🌊",
        label: "Take your time",
        bg: "bg-cyan-500/15 border-cyan-500/30 hover:bg-cyan-500/25 hover:border-cyan-500/50"
    },
    {
        id: "not-alone",
        emoji: "🤍",
        label: "You're not alone",
        bg: "bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/25 hover:border-violet-500/50"
    }
];
// Safe positions that avoid UI elements (timer at top, controls at bottom center, reaction buttons at bottom left)
const FLOAT_POSITIONS = [
    {
        x: 'right-8',
        y: 'top-32',
        drift: 'drift-1'
    },
    {
        x: 'right-12',
        y: 'top-1/3',
        drift: 'drift-2'
    },
    {
        x: 'right-6',
        y: 'top-1/2',
        drift: 'drift-3'
    },
    {
        x: 'left-1/3',
        y: 'top-28',
        drift: 'drift-4'
    },
    {
        x: 'right-1/4',
        y: 'top-24',
        drift: 'drift-1'
    },
    {
        x: 'right-16',
        y: 'bottom-1/3',
        drift: 'drift-2'
    },
    {
        x: 'left-1/4',
        y: 'top-1/4',
        drift: 'drift-3'
    },
    {
        x: 'right-1/3',
        y: 'bottom-1/4',
        drift: 'drift-4'
    }
];
function SilentReactionsSimple({ onSendReaction, realtimeReactions = [], myUserId }) {
    _s();
    const [localReactions, setLocalReactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [positionIndex, setPositionIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showReactions, setShowReactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSent, setShowSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Get next position cycling through available positions
    const getNextPosition = ()=>{
        const position = FLOAT_POSITIONS[positionIndex % FLOAT_POSITIONS.length];
        setPositionIndex((prev)=>prev + 1);
        return position;
    };
    // Handle incoming realtime reactions from other users
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SilentReactionsSimple.useEffect": ()=>{
            if (realtimeReactions.length > 0) {
                const latestReaction = realtimeReactions[realtimeReactions.length - 1];
                // Only show if it's from someone else
                if (latestReaction.userId === myUserId) return;
                const newReaction = {
                    id: latestReaction.id,
                    type: latestReaction.type,
                    isRemote: true,
                    username: latestReaction.username || "Someone",
                    userEmoji: latestReaction.emoji,
                    position: FLOAT_POSITIONS[Math.floor(Math.random() * FLOAT_POSITIONS.length)]
                };
                setLocalReactions({
                    "SilentReactionsSimple.useEffect": (prev)=>{
                        if (prev.some({
                            "SilentReactionsSimple.useEffect": (r)=>r.id === newReaction.id
                        }["SilentReactionsSimple.useEffect"])) return prev;
                        return [
                            ...prev,
                            newReaction
                        ];
                    }
                }["SilentReactionsSimple.useEffect"]);
                setTimeout({
                    "SilentReactionsSimple.useEffect": ()=>{
                        setLocalReactions({
                            "SilentReactionsSimple.useEffect": (prev)=>prev.filter({
                                    "SilentReactionsSimple.useEffect": (r)=>r.id !== newReaction.id
                                }["SilentReactionsSimple.useEffect"])
                        }["SilentReactionsSimple.useEffect"]);
                    }
                }["SilentReactionsSimple.useEffect"], 4000);
            }
        }
    }["SilentReactionsSimple.useEffect"], [
        realtimeReactions,
        myUserId
    ]);
    const handleReaction = (type)=>{
        const newReaction = {
            id: `local-${Date.now()}`,
            type,
            isRemote: false,
            position: getNextPosition()
        };
        setLocalReactions((prev)=>[
                ...prev,
                newReaction
            ]);
        setTimeout(()=>{
            setLocalReactions((prev)=>prev.filter((r)=>r.id !== newReaction.id));
        }, 4000);
        onSendReaction(type);
        setShowReactions(false);
        setShowSent(true);
        setTimeout(()=>{
            setShowSent(false);
        }, 1500);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            localReactions.map((reaction)=>{
                const btn = REACTIONS.find((b)=>b.id === reaction.type);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9d90c31b89944a6a" + " " + `fixed ${reaction.position.x} ${reaction.position.y} z-[100] pointer-events-none animate-float-reaction ${reaction.position.drift}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9d90c31b89944a6a" + " " + "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9d90c31b89944a6a" + " " + "absolute inset-0 blur-xl opacity-30 rounded-full bg-gradient-to-r from-foreground/20 to-transparent"
                            }, void 0, false, {
                                fileName: "[project]/components/SilentReactionsSimple.tsx",
                                lineNumber: 272,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9d90c31b89944a6a" + " " + "relative flex items-center gap-2 bg-card/80 backdrop-blur-lg border border-border/40 rounded-full px-4 py-2.5 shadow-2xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-9d90c31b89944a6a" + " " + "text-3xl animate-bounce-gentle",
                                        children: btn?.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9d90c31b89944a6a" + " " + "flex flex-col pr-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-9d90c31b89944a6a" + " " + "text-xs font-medium text-foreground/90",
                                                children: btn?.label
                                            }, void 0, false, {
                                                fileName: "[project]/components/SilentReactionsSimple.tsx",
                                                lineNumber: 278,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-9d90c31b89944a6a" + " " + "text-[10px] text-muted-foreground/70",
                                                children: reaction.isRemote && reaction.userEmoji ? `${reaction.userEmoji} ${reaction.username}` : "from you"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SilentReactionsSimple.tsx",
                                                lineNumber: 279,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SilentReactionsSimple.tsx",
                                lineNumber: 275,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                        lineNumber: 270,
                        columnNumber: 13
                    }, this)
                }, reaction.id, false, {
                    fileName: "[project]/components/SilentReactionsSimple.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowReactions((open)=>!open),
                "aria-expanded": showReactions,
                "aria-label": "Open reactions",
                className: "jsx-9d90c31b89944a6a" + " " + "fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-all active:scale-95 md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "jsx-9d90c31b89944a6a",
                    children: showSent ? "sent ✓" : "🫂 React"
                }, void 0, false, {
                    fileName: "[project]/components/SilentReactionsSimple.tsx",
                    lineNumber: 299,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SilentReactionsSimple.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            showReactions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9d90c31b89944a6a" + " " + "md:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowReactions(false),
                        "aria-label": "Close reactions",
                        className: "jsx-9d90c31b89944a6a" + " " + "fixed inset-0 z-30 bg-black/20"
                    }, void 0, false, {
                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9d90c31b89944a6a" + " " + "fixed bottom-36 right-4 z-40 grid w-72 grid-cols-2 gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm",
                        children: REACTIONS.map((btn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleReaction(btn.id),
                                "aria-label": btn.label,
                                className: "jsx-9d90c31b89944a6a" + " " + "flex min-h-14 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs leading-tight text-foreground transition-colors hover:bg-secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-9d90c31b89944a6a" + " " + "text-lg",
                                        children: btn.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-9d90c31b89944a6a",
                                        children: btn.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, btn.id, true, {
                                fileName: "[project]/components/SilentReactionsSimple.tsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/SilentReactionsSimple.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SilentReactionsSimple.tsx",
                lineNumber: 303,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9d90c31b89944a6a" + " " + "fixed bottom-6 left-4 z-40 hidden md:left-6 md:flex",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9d90c31b89944a6a" + " " + "flex flex-col gap-2",
                    children: REACTIONS.map((btn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleReaction(btn.id),
                            "aria-label": btn.label,
                            className: "jsx-9d90c31b89944a6a" + " " + `
                group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full border backdrop-blur-md
                transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${btn.bg}
              `,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-9d90c31b89944a6a" + " " + "text-lg group-hover:scale-110 transition-transform",
                                    children: btn.emoji
                                }, void 0, false, {
                                    fileName: "[project]/components/SilentReactionsSimple.tsx",
                                    lineNumber: 339,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-9d90c31b89944a6a" + " " + "text-xs text-foreground/70 font-medium group-hover:text-foreground/90 transition-colors",
                                    children: btn.label
                                }, void 0, false, {
                                    fileName: "[project]/components/SilentReactionsSimple.tsx",
                                    lineNumber: 340,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, btn.id, true, {
                            fileName: "[project]/components/SilentReactionsSimple.tsx",
                            lineNumber: 330,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/SilentReactionsSimple.tsx",
                    lineNumber: 328,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SilentReactionsSimple.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9d90c31b89944a6a",
                children: "@keyframes float-reaction{0%{opacity:0;transform:scale(.5)translateY(30px)}15%{opacity:1;transform:scale(1)translateY(0)}85%{opacity:1;transform:scale(1)translateY(-10px)}to{opacity:0;transform:scale(.8)translateY(-40px)}}.animate-float-reaction.jsx-9d90c31b89944a6a{animation:4s ease-in-out forwards float-reaction}@keyframes drift-1{0%,to{transform:translate(0)}25%{transform:translate(5px,-8px)}50%{transform:translate(-3px,-12px)}75%{transform:translate(4px,-6px)}}@keyframes drift-2{0%,to{transform:translate(0)}25%{transform:translate(-6px,-5px)}50%{transform:translate(4px,-10px)}75%{transform:translate(-2px,-8px)}}@keyframes drift-3{0%,to{transform:translate(0)}25%{transform:translate(4px,-10px)}50%{transform:translate(-5px,-6px)}75%{transform:translate(3px,-12px)}}@keyframes drift-4{0%,to{transform:translate(0)}25%{transform:translate(-4px,-6px)}50%{transform:translate(6px,-8px)}75%{transform:translate(-3px,-10px)}}.drift-1.jsx-9d90c31b89944a6a{animation:3s ease-in-out infinite drift-1,4s ease-in-out forwards float-reaction}.drift-2.jsx-9d90c31b89944a6a{animation:3.5s ease-in-out infinite drift-2,4s ease-in-out forwards float-reaction}.drift-3.jsx-9d90c31b89944a6a{animation:2.8s ease-in-out infinite drift-3,4s ease-in-out forwards float-reaction}.drift-4.jsx-9d90c31b89944a6a{animation:3.2s ease-in-out infinite drift-4,4s ease-in-out forwards float-reaction}@keyframes bounce-gentle{0%,to{transform:translateY(0)}50%{transform:translateY(-3px)}}.animate-bounce-gentle.jsx-9d90c31b89944a6a{animation:1.5s ease-in-out infinite bounce-gentle}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
_s(SilentReactionsSimple, "MTQNQD7eCeLMux4VnwFHkQEptRU=");
_c = SilentReactionsSimple;
var _c;
__turbopack_context__.k.register(_c, "SilentReactionsSimple");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/countdown-timer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CountdownTimer",
    ()=>CountdownTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
"use client";
;
;
;
const emotionColors = {
    anxious: "#a855f7",
    lonely: "#3b82f6",
    "burnt-out": "#f97316",
    "just-talk": "#10b981"
};
function CountdownTimer({ timeRemaining, emotion, progress = 0, isNewSession = false, isResumed = false, isCompleted = false, isLastTwoMinutes = false, showArrival = false }) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const progressFraction = progress / 100 // Convert percentage to fraction
    ;
    const baseColor = emotionColors[emotion] || emotionColors.anxious;
    // Color changes to red in last 2 minutes
    const color = isLastTwoMinutes ? "#ef4444" : baseColor;
    const circumference = 2 * Math.PI * 120 // radius of 120
    ;
    if (isCompleted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-64 h-64 flex items-center justify-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "absolute inset-0 w-full h-full -rotate-90",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "128",
                            cy: "128",
                            r: "120",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            className: "text-border"
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "128",
                            cy: "128",
                            r: "120",
                            fill: "none",
                            stroke: "#10b981",
                            strokeWidth: "3",
                            strokeLinecap: "round",
                            style: {
                                filter: "drop-shadow(0 0 8px #10b98140)"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/countdown-timer.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute inset-4 rounded-full",
                    style: {
                        background: "radial-gradient(circle, #10b98120 0%, transparent 70%)"
                    },
                    animate: {
                        opacity: [
                            0.5,
                            0.8,
                            0.5
                        ],
                        scale: [
                            1,
                            1.1,
                            1
                        ]
                    },
                    transition: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    }
                }, void 0, false, {
                    fileName: "[project]/components/countdown-timer.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                scale: 0.8,
                                opacity: 0
                            },
                            animate: {
                                scale: 1,
                                opacity: 1
                            },
                            transition: {
                                type: "spring",
                                damping: 15
                            },
                            className: "text-4xl mb-2",
                            children: "✨"
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                delay: 0.2
                            },
                            className: "text-lg font-medium text-foreground",
                            children: "Session Complete"
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            transition: {
                                delay: 0.4
                            },
                            className: "text-sm text-muted-foreground mt-1",
                            children: "Take a breath..."
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/countdown-timer.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/countdown-timer.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
            [
                "717e1b82bc8ff3be",
                [
                    color,
                    color
                ]
            ]
        ]) + " " + "relative w-64 h-64 flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: (isNewSession || isResumed) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    className: `absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${isNewSession ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`,
                    children: isNewSession ? "New session" : `Resumed: ${minutes}:${String(seconds).padStart(2, "0")} left`
                }, void 0, false, {
                    fileName: "[project]/components/countdown-timer.tsx",
                    lineNumber: 123,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/countdown-timer.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "717e1b82bc8ff3be",
                        [
                            color,
                            color
                        ]
                    ]
                ]) + " " + `absolute inset-0 w-full h-full -rotate-90 ${showArrival ? "timer-arrival-pulse" : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "128",
                        cy: "128",
                        r: "120",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                            [
                                "717e1b82bc8ff3be",
                                [
                                    color,
                                    color
                                ]
                            ]
                        ]) + " " + "text-border"
                    }, void 0, false, {
                        fileName: "[project]/components/countdown-timer.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].circle, {
                        cx: "128",
                        cy: "128",
                        r: "120",
                        fill: "none",
                        stroke: color,
                        strokeWidth: "3",
                        strokeLinecap: "round",
                        strokeDasharray: circumference,
                        strokeDashoffset: circumference * (1 - progressFraction),
                        style: {
                            filter: `drop-shadow(0 0 8px ${color}40)`
                        },
                        transition: {
                            duration: 0.5
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/countdown-timer.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/countdown-timer.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute inset-4 rounded-full",
                style: {
                    background: `radial-gradient(circle, ${color}${isLastTwoMinutes ? "20" : "10"} 0%, transparent 70%)`
                },
                animate: isLastTwoMinutes ? {
                    opacity: [
                        0.4,
                        0.8,
                        0.4
                    ],
                    scale: [
                        1,
                        1.08,
                        1
                    ]
                } : {
                    opacity: [
                        0.3,
                        0.6,
                        0.3
                    ],
                    scale: [
                        1,
                        1.05,
                        1
                    ]
                },
                transition: {
                    repeat: Infinity,
                    duration: isLastTwoMinutes ? 1.5 : 4,
                    ease: "easeInOut"
                }
            }, void 0, false, {
                fileName: "[project]/components/countdown-timer.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                    [
                        "717e1b82bc8ff3be",
                        [
                            color,
                            color
                        ]
                    ]
                ]) + " " + "relative z-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            scale: 1.05,
                            opacity: 0.8
                        },
                        animate: {
                            scale: 1,
                            opacity: 1
                        },
                        className: `text-5xl font-light tracking-tight transition-colors duration-300 ${isLastTwoMinutes ? "text-red-400" : "text-foreground"}`,
                        children: [
                            String(minutes).padStart(2, "0"),
                            ":",
                            String(seconds).padStart(2, "0")
                        ]
                    }, timeRemaining, true, {
                        fileName: "[project]/components/countdown-timer.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].dynamic([
                            [
                                "717e1b82bc8ff3be",
                                [
                                    color,
                                    color
                                ]
                            ]
                        ]) + " " + `text-sm mt-2 transition-colors duration-300 ${isLastTwoMinutes ? "text-red-400/70" : "text-muted-foreground"}`,
                        children: isLastTwoMinutes ? "almost there..." : "remaining"
                    }, void 0, false, {
                        fileName: "[project]/components/countdown-timer.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showArrival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: "hidden",
                            animate: "visible",
                            exit: "hidden",
                            variants: {
                                hidden: {
                                    opacity: 0,
                                    transition: {
                                        duration: 1
                                    }
                                },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        duration: 0.5
                                    }
                                }
                            },
                            className: "absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground/30",
                            children: "another soul arrived"
                        }, void 0, false, {
                            fileName: "[project]/components/countdown-timer.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/countdown-timer.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/countdown-timer.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            [
                ...Array(8)
            ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute w-1.5 h-1.5 rounded-full",
                    style: {
                        backgroundColor: color,
                        opacity: 0.4,
                        top: `${50 + 45 * Math.sin(i * Math.PI * 2 / 8)}%`,
                        left: `${50 + 45 * Math.cos(i * Math.PI * 2 / 8)}%`,
                        transform: "translate(-50%, -50%)"
                    },
                    animate: isLastTwoMinutes ? {
                        opacity: [
                            0.3,
                            0.7,
                            0.3
                        ],
                        scale: [
                            0.8,
                            1.4,
                            0.8
                        ]
                    } : {
                        opacity: [
                            0.2,
                            0.5,
                            0.2
                        ],
                        scale: [
                            0.8,
                            1.2,
                            0.8
                        ]
                    },
                    transition: {
                        repeat: Infinity,
                        duration: isLastTwoMinutes ? 1 : 3,
                        delay: i * 0.2
                    }
                }, i, false, {
                    fileName: "[project]/components/countdown-timer.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "717e1b82bc8ff3be",
                dynamic: [
                    color,
                    color
                ],
                children: `@keyframes timer-arrival-pulse{0%,to{filter:drop-shadow(0 0 #0000)}20%{filter:drop-shadow(0 0 18px ${color}55)}55%{filter:drop-shadow(0 0 28px ${color}33)}}.timer-arrival-pulse.__jsx-style-dynamic-selector{animation:1.2s ease-in-out timer-arrival-pulse}`
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/countdown-timer.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
_c = CountdownTimer;
var _c;
__turbopack_context__.k.register(_c, "CountdownTimer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/room/[emotion]/room-client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoomClient",
    ()=>RoomClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic-off.js [app-client] (ecmascript) <export default as MicOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$realtime$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-realtime-room.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$audio$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-audio-room.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$timer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-persistent-timer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SilentReactionsSimple$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SilentReactionsSimple.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$countdown$2d$timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/countdown-timer.tsx [app-client] (ecmascript)");
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
;
const emotionConfig = {
    anxious: {
        label: "Anxiety Sanctuary",
        color: "text-purple-400",
        bgGradient: "from-purple-900/20 via-transparent to-transparent"
    },
    lonely: {
        label: "Loneliness Sanctuary",
        color: "text-blue-400",
        bgGradient: "from-blue-900/20 via-transparent to-transparent"
    },
    "burnt-out": {
        label: "Burnout Sanctuary",
        color: "text-orange-400",
        bgGradient: "from-orange-900/20 via-transparent to-transparent"
    },
    "just-talk": {
        label: "Connection Sanctuary",
        color: "text-emerald-400",
        bgGradient: "from-emerald-900/20 via-transparent to-transparent"
    }
};
const emotionColors = {
    anxious: "#a855f7",
    lonely: "#3b82f6",
    "burnt-out": "#f97316",
    "just-talk": "#10b981"
};
function RoomClient({ emotion }) {
    _s();
    const safeEmotion = emotion && emotionConfig[emotion] ? emotion : "anxious";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMuted, setIsMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showArrival, setShowArrival] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [firstTimerMessage, setFirstTimerMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sessionEnded, setSessionEnded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSessionOptions, setShowSessionOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const previousParticipantCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const sessionCompletionHandled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Generate a stable anonymous user ID
    // const anonymousUserId = useMemo(() => {
    //   if (typeof window === "undefined") return "user-ssr"
    //   const stored = sessionStorage.getItem("unmute-user-id")
    //   if (stored) return stored
    //   const newId = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    //   sessionStorage.setItem("unmute-user-id", newId)
    //   return newId
    // }, [])
    const [anonymousUserId, setAnonymousUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            const stored = sessionStorage.getItem("unmute-user-id");
            if (stored) {
                setAnonymousUserId(stored);
            } else {
                const newId = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                sessionStorage.setItem("unmute-user-id", newId);
                setAnonymousUserId(newId);
            }
        }
    }["RoomClient.useEffect"], []);
    // Backend session management
    const { room, session, leaveRoom, sendReaction } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])(safeEmotion);
    // Realtime presence and reactions
    const { participants, reactions: realtimeReactions, isConnected: isRealtimeConnected, broadcastReaction, myAvatar, participantCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$realtime$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtimeRoom"])(room?.id || null, anonymousUserId);
    // Handle session completion
    const handleSessionComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoomClient.useCallback[handleSessionComplete]": async ()=>{
            if (sessionCompletionHandled.current) return;
            sessionCompletionHandled.current = true;
            setSessionEnded(true);
            await leaveRoom(14 * 60); // Full session duration
        }
    }["RoomClient.useCallback[handleSessionComplete]"], [
        leaveRoom
    ]);
    // Persistent timer that survives page refreshes
    const { timeRemaining, isNewSession, isResumed, isCompleted, progress, isLastTwoMinutes, clearSession } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$timer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentTimer"])({
        roomId: room?.id || null,
        emotion: safeEmotion,
        onComplete: handleSessionComplete
    });
    // Audio room (LiveKit)
    const audioRoomName = room?.id ? `unmute-${room.id}` : "unmute-default";
    const { isConnected: isAudioConnected, isConnecting: isAudioConnecting, isMuted: audioIsMuted, audioEnabled, error: audioError, connect: connectAudio, toggleMute: toggleAudioMute, participantAudioLevels } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$audio$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudioRoom"])(audioRoomName, myAvatar ? myAvatar.name : "anonymous");
    // Sync local mute state with audio hook
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            setIsMuted(audioIsMuted);
        }
    }["RoomClient.useEffect"], [
        audioIsMuted
    ]);
    // Handle mute toggle - connect first if needed, then toggle via LiveKit API
    const handleToggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoomClient.useCallback[handleToggleMute]": async ()=>{
            if (!isAudioConnected && !isAudioConnecting) {
                // First click: connect to LiveKit room (mic starts muted)
                await connectAudio();
                return;
            }
            if (isAudioConnecting) {
                // Still connecting, ignore clicks
                return;
            }
            // Connected: toggle mic via LiveKit's setMicrophoneEnabled
            toggleAudioMute();
        }
    }["RoomClient.useCallback[handleToggleMute]"], [
        connectAudio,
        toggleAudioMute,
        isAudioConnected,
        isAudioConnecting
    ]);
    const config = emotionConfig[safeEmotion] || emotionConfig.anxious;
    const color = emotionColors[safeEmotion] || emotionColors.anxious;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            setMounted(true);
        }
    }["RoomClient.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            const fadeInTimer = setTimeout({
                "RoomClient.useEffect.fadeInTimer": ()=>{
                    setFirstTimerMessage("visible");
                }
            }["RoomClient.useEffect.fadeInTimer"], 2000);
            const fadeOutTimer = setTimeout({
                "RoomClient.useEffect.fadeOutTimer": ()=>{
                    setFirstTimerMessage("exiting");
                }
            }["RoomClient.useEffect.fadeOutTimer"], 32000);
            const removeTimer = setTimeout({
                "RoomClient.useEffect.removeTimer": ()=>{
                    setFirstTimerMessage(null);
                }
            }["RoomClient.useEffect.removeTimer"], 35000);
            return ({
                "RoomClient.useEffect": ()=>{
                    clearTimeout(fadeInTimer);
                    clearTimeout(fadeOutTimer);
                    clearTimeout(removeTimer);
                }
            })["RoomClient.useEffect"];
        }
    }["RoomClient.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            const previous = previousParticipantCount.current;
            if (previous > 0 && participantCount > previous) {
                setShowArrival(true);
                const timer = setTimeout({
                    "RoomClient.useEffect.timer": ()=>{
                        setShowArrival(false);
                    }
                }["RoomClient.useEffect.timer"], 3500);
                previousParticipantCount.current = participantCount;
                return ({
                    "RoomClient.useEffect": ()=>clearTimeout(timer)
                })["RoomClient.useEffect"];
            }
            previousParticipantCount.current = participantCount;
        }
    }["RoomClient.useEffect"], [
        participantCount
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoomClient.useEffect": ()=>{
            if (!sessionEnded && !isCompleted) return;
            const timer = setTimeout({
                "RoomClient.useEffect.timer": ()=>{
                    setShowSessionOptions(true);
                }
            }["RoomClient.useEffect.timer"], 2000);
            return ({
                "RoomClient.useEffect": ()=>clearTimeout(timer)
            })["RoomClient.useEffect"];
        }
    }["RoomClient.useEffect"], [
        sessionEnded,
        isCompleted
    ]);
    const isConnected = isRealtimeConnected;
    const handleLeave = async ()=>{
        const durationSeconds = 14 * 60 - timeRemaining;
        await leaveRoom(durationSeconds);
        clearSession();
        router.push(`/reflection?emotion=${safeEmotion}&sessionId=${session?.id || ""}`);
    };
    // if (!mounted || isLoading) {
    //   return (
    //     <main className="min-h-screen bg-background flex items-center justify-center">
    //       <div className="text-center">
    //         <div className="animate-pulse text-muted-foreground mb-2">Loading sanctuary...</div>
    //         {isLoading && (
    //           <div className="text-xs text-muted-foreground/60">Finding your room</div>
    //         )}
    //       </div>
    //     </main>
    //   )
    // }
    if (!mounted || !anonymousUserId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "min-h-screen bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-muted-foreground",
                        children: "Preparing your sanctuary..."
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/room/[emotion]/room-client.tsx",
            lineNumber: 226,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-a1972fb3a6eb61d2" + " " + "min-h-screen bg-background relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a1972fb3a6eb61d2" + " " + "absolute inset-0 pointer-events-none overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + `absolute inset-0 bg-gradient-to-br ${config.bgGradient}`
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: color,
                            animationDuration: '8s'
                        },
                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-[0.03] blur-3xl animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: color,
                            animationDuration: '6s',
                            animationDelay: '2s'
                        },
                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute bottom-1/4 -right-20 w-80 h-80 rounded-full opacity-[0.05] blur-3xl animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: color
                        },
                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-a1972fb3a6eb61d2" + " " + "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a1972fb3a6eb61d2" + " " + "container mx-auto px-4 py-4 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    prefetch: false,
                                    "aria-label": "Return to home page",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": "Go back to sanctuary selection",
                                        className: "jsx-a1972fb3a6eb61d2" + " " + "p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors hover:scale-105 active:scale-95",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            className: "w-4 h-4 text-muted-foreground",
                                            "aria-hidden": "true"
                                        }, void 0, false, {
                                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 264,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    "aria-live": "polite",
                                    className: "jsx-a1972fb3a6eb61d2" + " " + `text-lg font-medium ${config.color} animate-in fade-in slide-in-from-left-2 duration-300`,
                                    children: config.label
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "text-sm text-muted-foreground animate-in fade-in duration-500 delay-200",
                            children: isCompleted ? "Session complete" : "Session in progress"
                        }, void 0, false, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 276,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a1972fb3a6eb61d2" + " " + "container mx-auto px-4 pt-24 pb-40 flex min-h-screen flex-col items-center justify-start md:justify-center md:pt-28 md:pb-36 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + "mt-8 mb-5 animate-in fade-in zoom-in-95 duration-500 delay-300 md:mt-0 md:mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$countdown$2d$timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CountdownTimer"], {
                                timeRemaining: timeRemaining,
                                emotion: emotion,
                                progress: progress,
                                isNewSession: isNewSession,
                                isResumed: isResumed,
                                isCompleted: isCompleted,
                                isLastTwoMinutes: isLastTwoMinutes,
                                showArrival: showArrival
                            }, void 0, false, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            firstTimerMessage && !isCompleted && !sessionEnded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + `mt-5 text-center text-xs text-muted-foreground/30 transition-opacity duration-1000 ${firstTimerMessage === "visible" ? "opacity-100" : "opacity-0"}`,
                                children: "Anonymous. Not recorded. Just present."
                            }, void 0, false, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + "mb-5 flex w-full max-w-md justify-center md:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + `
            inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs
            ${isRealtimeConnected ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border border-amber-500/20 bg-amber-500/10 text-amber-400"}
          `,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-a1972fb3a6eb61d2" + " " + `h-2 w-2 rounded-full ${isRealtimeConnected ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                isRealtimeConnected ? `${participantCount} ${participantCount === 1 ? "soul" : "souls"} present` : "Joining sanctuary..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + "mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 md:mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: color
                                        },
                                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute inset-0 blur-2xl opacity-20 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a1972fb3a6eb61d2" + " " + "relative flex h-20 items-center justify-center gap-[3px] px-4 md:h-28 md:px-8",
                                        children: [
                                            ...Array(32)
                                        ].map((_, i)=>{
                                            const baseHeight = Math.sin(i / 32 * Math.PI) * 0.8 + 0.2;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: isLastTwoMinutes ? "#ef4444" : color,
                                                    opacity: isMuted ? 0.2 : 0.7,
                                                    height: isMuted ? `${baseHeight * 20}px` : `${baseHeight * 50}px`,
                                                    animation: isMuted ? "none" : `audioBar 2s ease-in-out ${i * 0.08}s infinite`,
                                                    boxShadow: isMuted ? 'none' : `0 0 10px ${color}40`
                                                },
                                                className: "jsx-a1972fb3a6eb61d2" + " " + "w-1.5 rounded-full transition-all duration-500"
                                            }, i, false, {
                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 327,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + "text-center text-xs text-muted-foreground/60 mt-3",
                                children: isMuted ? "Your mic is muted" : "Speaking..."
                            }, void 0, false, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + "mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + "mb-6 hidden w-full max-w-md justify-start md:flex",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-a1972fb3a6eb61d2" + " " + `
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs
              ${isRealtimeConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}
            `,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-a1972fb3a6eb61d2" + " " + `w-2 h-2 rounded-full ${isRealtimeConnected ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`
                                        }, void 0, false, {
                                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                            lineNumber: 370,
                                            columnNumber: 15
                                        }, this),
                                        isRealtimeConnected ? `${participantCount} ${participantCount === 1 ? "soul" : "souls"} present` : "Joining sanctuary..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + "mx-auto flex max-w-md items-center justify-center gap-4 md:gap-24",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-a1972fb3a6eb61d2" + " " + "hidden items-center justify-center gap-2 flex-wrap md:flex",
                                        children: participants.length > 0 ? participants.slice(0, 10).map((participant, index)=>{
                                            const audioLevel = participantAudioLevels.get(participant.username) || 0;
                                            const isSpeaking = audioLevel > 0.1;
                                            const isMe = participant.userId === anonymousUserId;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: `${color}15`,
                                                    borderWidth: '2px',
                                                    borderColor: isMe ? color : `${color}30`,
                                                    animationDelay: `${600 + index * 100}ms`
                                                },
                                                title: participant.username,
                                                className: "jsx-a1972fb3a6eb61d2" + " " + `
                        relative w-14 h-14 rounded-full flex items-center justify-center 
                        animate-in fade-in zoom-in duration-300 transition-all
                        ${isMe ? "ring-2 ring-offset-2 ring-offset-background" : ""}
                        ${isSpeaking ? "scale-110" : ""}
                      `,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + "text-xl",
                                                        children: participant.emoji
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 23
                                                    }, this),
                                                    isMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            backgroundColor: color,
                                                            color: '#000'
                                                        },
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-medium px-1.5 py-0.5 rounded-full",
                                                        children: "You"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 25
                                                    }, this),
                                                    isSpeaking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, participant.userId, true, {
                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                lineNumber: 387,
                                                columnNumber: 21
                                            }, this);
                                        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                backgroundColor: `${color}15`,
                                                borderWidth: '2px',
                                                borderColor: color
                                            },
                                            className: "jsx-a1972fb3a6eb61d2" + " " + "w-14 h-14 rounded-full flex items-center justify-center animate-pulse",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-a1972fb3a6eb61d2" + " " + "text-xl",
                                                children: myAvatar?.emoji || "?"
                                            }, void 0, false, {
                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                lineNumber: 423,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                            lineNumber: 419,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this),
                                    !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-a1972fb3a6eb61d2" + " " + "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + "absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground",
                                                        children: isMuted ? "tap when you're ready" : "Tap to mute"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 432,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleToggleMute,
                                                        disabled: !isConnected,
                                                        style: {
                                                            backgroundColor: isMuted ? undefined : color,
                                                            boxShadow: isMuted ? undefined : `0 0 24px ${color}40`
                                                        },
                                                        title: !isConnected ? "Connecting..." : isMuted ? "Unmute" : "Mute",
                                                        "aria-label": !isConnected ? "Connecting to audio" : isMuted ? "Unmute microphone" : "Mute microphone",
                                                        "aria-pressed": !isMuted,
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + `
                      relative w-16 h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg
                      ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}
                      ${isMuted ? "bg-card text-muted-foreground border-2 border-border" : "text-background"}
                    `,
                                                        children: [
                                                            isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                                                                className: "w-6 h-6",
                                                                "aria-hidden": "true"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 32
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                                className: "w-6 h-6",
                                                                "aria-hidden": "true"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 84
                                                            }, this),
                                                            !isMuted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    backgroundColor: color,
                                                                    opacity: 0.2
                                                                },
                                                                className: "jsx-a1972fb3a6eb61d2" + " " + "absolute inset-0 rounded-full animate-ping"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                                lineNumber: 458,
                                                                columnNumber: 23
                                                            }, this),
                                                            isAudioConnecting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    animationDuration: "2s"
                                                                },
                                                                className: "jsx-a1972fb3a6eb61d2" + " " + "absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                                lineNumber: 464,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 435,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                lineNumber: 431,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleLeave,
                                                "aria-label": "Leave the sanctuary and go to reflection",
                                                className: "jsx-a1972fb3a6eb61d2" + " " + "flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-300 border border-border/50 hover:border-border text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                        className: "w-4 h-4",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-a1972fb3a6eb61d2" + " " + "font-medium",
                                                        children: "Leave Quietly"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                                lineNumber: 470,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            !audioEnabled && audioError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-a1972fb3a6eb61d2" + " " + "text-xs text-muted-foreground/60 mt-4 text-center flex items-center justify-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                        lineNumber: 484,
                                        columnNumber: 15
                                    }, this),
                                    "Audio unavailable - reactions only"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-a1972fb3a6eb61d2" + " " + "mt-10 text-center max-w-sm mx-auto animate-in fade-in duration-500 delay-700",
                        children: isCompleted || sessionEnded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "text-muted-foreground",
                            children: "Taking a breath..."
                        }, void 0, false, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-a1972fb3a6eb61d2" + " " + "text-sm text-muted-foreground/80 leading-relaxed",
                                    children: isMuted ? "Take your time. Speak when you're ready." : "We hear you. You're not alone."
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 496,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-a1972fb3a6eb61d2" + " " + "text-xs text-muted-foreground/50 mt-2",
                                    children: "Everything shared here stays here."
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 501,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/room/[emotion]/room-client.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this),
            !isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SilentReactionsSimple$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SilentReactionsSimple"], {
                onSendReaction: async (type)=>{
                    await sendReaction(type);
                    await broadcastReaction(type);
                },
                realtimeReactions: realtimeReactions,
                myUserId: anonymousUserId
            }, void 0, false, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 511,
                columnNumber: 9
            }, this),
            (isCompleted || sessionEnded) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-a1972fb3a6eb61d2" + " " + "fixed inset-0 z-[120] flex items-center justify-center bg-background/98 backdrop-blur-sm animate-session-complete",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-a1972fb3a6eb61d2" + " " + "relative z-10 flex flex-col items-center px-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "text-3xl font-light text-foreground/90 sm:text-4xl",
                            children: "This session is complete."
                        }, void 0, false, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 524,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "mt-4 text-sm text-muted-foreground/70 sm:text-base",
                            children: "You showed up for someone today."
                        }, void 0, false, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 527,
                            columnNumber: 13
                        }, this),
                        showSessionOptions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-a1972fb3a6eb61d2" + " " + "mt-10 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 sm:flex-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    prefetch: false,
                                    className: "rounded-full border border-border bg-card/50 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-border/80 hover:bg-card hover:text-foreground",
                                    children: "Return home"
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 533,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    prefetch: false,
                                    className: "rounded-full border px-5 py-2.5 text-sm transition-all hover:scale-[1.01]",
                                    style: {
                                        borderColor: `${color}55`,
                                        backgroundColor: `${color}14`,
                                        color
                                    },
                                    children: "Join another room"
                                }, void 0, false, {
                                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                                    lineNumber: 540,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/room/[emotion]/room-client.tsx",
                            lineNumber: 532,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/room/[emotion]/room-client.tsx",
                    lineNumber: 523,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/room/[emotion]/room-client.tsx",
                lineNumber: 522,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "a1972fb3a6eb61d2",
                children: "@keyframes audioBar{0%,to{opacity:.4;transform:scaleY(.5)}50%{opacity:.9;transform:scaleY(1.5)}}@keyframes session-complete{0%{opacity:0}to{opacity:1}}.animate-session-complete.jsx-a1972fb3a6eb61d2{animation:1s forwards session-complete}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/room/[emotion]/room-client.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_s(RoomClient, "XU/v5sTTKwdCuBWxpNKaZZZ13Hk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$realtime$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRealtimeRoom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$persistent$2d$timer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePersistentTimer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$audio$2d$room$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAudioRoom"]
    ];
});
_c = RoomClient;
var _c;
__turbopack_context__.k.register(_c, "RoomClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_a4b152f5._.js.map