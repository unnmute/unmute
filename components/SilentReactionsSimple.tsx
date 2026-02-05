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
"use client"

import { useState, useEffect, useMemo } from "react"

interface RealtimeReaction {
  id: string
  userId: string
  username?: string
  emoji?: string
  type: "heart" | "wave" | "peace"
  timestamp: number
}

interface SilentReactionsSimpleProps {
  onSendReaction: (type: "heart" | "wave" | "peace") => Promise<void>
  realtimeReactions?: RealtimeReaction[]
  myUserId?: string
}

// Safe positions that avoid UI elements (timer at top, controls at bottom center, reaction buttons at bottom left)
const FLOAT_POSITIONS = [
  { x: 'right-8', y: 'top-32', drift: 'drift-1' },
  { x: 'right-12', y: 'top-1/3', drift: 'drift-2' },
  { x: 'right-6', y: 'top-1/2', drift: 'drift-3' },
  { x: 'left-1/3', y: 'top-28', drift: 'drift-4' },
  { x: 'right-1/4', y: 'top-24', drift: 'drift-1' },
  { x: 'right-16', y: 'bottom-1/3', drift: 'drift-2' },
  { x: 'left-1/4', y: 'top-1/4', drift: 'drift-3' },
  { x: 'right-1/3', y: 'bottom-1/4', drift: 'drift-4' },
]

export function SilentReactionsSimple({ onSendReaction, realtimeReactions = [], myUserId }: SilentReactionsSimpleProps) {
  const [localReactions, setLocalReactions] = useState<Array<{ 
    id: string
    type: string
    isRemote: boolean
    username?: string
    userEmoji?: string
    position: typeof FLOAT_POSITIONS[0]
  }>>([])
  
  const [positionIndex, setPositionIndex] = useState(0)

  // Get next position cycling through available positions
  const getNextPosition = () => {
    const position = FLOAT_POSITIONS[positionIndex % FLOAT_POSITIONS.length]
    setPositionIndex(prev => prev + 1)
    return position
  }

  // Handle incoming realtime reactions from other users
  useEffect(() => {
    if (realtimeReactions.length > 0) {
      const latestReaction = realtimeReactions[realtimeReactions.length - 1]
      
      // Only show if it's from someone else
      if (latestReaction.userId === myUserId) return
      
      const newReaction = {
        id: latestReaction.id,
        type: latestReaction.type,
        isRemote: true,
        username: latestReaction.username || "Someone",
        userEmoji: latestReaction.emoji,
        position: FLOAT_POSITIONS[Math.floor(Math.random() * FLOAT_POSITIONS.length)],
      }
      
      setLocalReactions((prev) => {
        if (prev.some((r) => r.id === newReaction.id)) return prev
        return [...prev, newReaction]
      })
      
      setTimeout(() => {
        setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
      }, 4000)
    }
  }, [realtimeReactions, myUserId])

  const handleReaction = (type: "heart" | "wave" | "peace") => {
    const newReaction = {
      id: `local-${Date.now()}`,
      type,
      isRemote: false,
      position: getNextPosition(),
    }
    setLocalReactions((prev) => [...prev, newReaction])
    setTimeout(() => {
      setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
    }, 4000)

    onSendReaction(type)
  }

  const reactionButtons = [
    { type: "heart" as const, emoji: "\uD83E\uDEC2", label: "Support", bg: "bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50" },
    { type: "wave" as const, emoji: "\uD83D\uDC4B", label: "Here for you", bg: "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50" },
    { type: "peace" as const, emoji: "\uD83D\uDE4F", label: "Grateful", bg: "bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50" },
  ]

  return (
    <>
      {/* Floating Reactions - Scattered around the screen */}
      {localReactions.map((reaction) => {
        const btn = reactionButtons.find((b) => b.type === reaction.type)
        return (
          <div
            key={reaction.id}
            className={`fixed ${reaction.position.x} ${reaction.position.y} z-[100] pointer-events-none animate-float-reaction ${reaction.position.drift}`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-xl opacity-30 rounded-full bg-gradient-to-r from-foreground/20 to-transparent" />
              
              {/* Main reaction bubble */}
              <div className="relative flex items-center gap-2 bg-card/80 backdrop-blur-lg border border-border/40 rounded-full px-4 py-2.5 shadow-2xl">
                <span className="text-3xl animate-bounce-gentle">{btn?.emoji}</span>
                <div className="flex flex-col pr-1">
                  <span className="text-xs font-medium text-foreground/90">{btn?.label}</span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {reaction.isRemote && reaction.userEmoji 
                      ? `${reaction.userEmoji} ${reaction.username}`
                      : "from you"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Reaction Buttons - Compact floating pills at bottom left */}
      <div className="fixed bottom-6 left-4 md:left-6 z-40">
        <div className="flex flex-col gap-2">
          {reactionButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleReaction(btn.type)}
              className={`
                group flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full border backdrop-blur-md
                transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${btn.bg}
              `}
              aria-label={btn.label}
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{btn.emoji}</span>
              <span className="text-xs text-foreground/70 font-medium group-hover:text-foreground/90 transition-colors">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-reaction {
          0% { 
            opacity: 0; 
            transform: scale(0.5) translateY(30px); 
          }
          15% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
          85% { 
            opacity: 1; 
            transform: scale(1) translateY(-10px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.8) translateY(-40px); 
          }
        }
        .animate-float-reaction {
          animation: float-reaction 4s ease-in-out forwards;
        }
        
        @keyframes drift-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -8px); }
          50% { transform: translate(-3px, -12px); }
          75% { transform: translate(4px, -6px); }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-6px, -5px); }
          50% { transform: translate(4px, -10px); }
          75% { transform: translate(-2px, -8px); }
        }
        @keyframes drift-3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(4px, -10px); }
          50% { transform: translate(-5px, -6px); }
          75% { transform: translate(3px, -12px); }
        }
        @keyframes drift-4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-4px, -6px); }
          50% { transform: translate(6px, -8px); }
          75% { transform: translate(-3px, -10px); }
        }
        .drift-1 { animation: drift-1 3s ease-in-out infinite, float-reaction 4s ease-in-out forwards; }
        .drift-2 { animation: drift-2 3.5s ease-in-out infinite, float-reaction 4s ease-in-out forwards; }
        .drift-3 { animation: drift-3 2.8s ease-in-out infinite, float-reaction 4s ease-in-out forwards; }
        .drift-4 { animation: drift-4 3.2s ease-in-out infinite, float-reaction 4s ease-in-out forwards; }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
