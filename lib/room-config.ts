export const ROOM_CONFIGS = [
  {
    id: "anxious",
    selectionLabel: "ANXIOUS",
    selectionDescription: "Racing thoughts, worry, unease",
    sanctuaryLabel: "Anxiety Sanctuary",
    sessionColor: "#a855f7",
    roomPageTextColorClass: "text-purple-400",
    roomPageBackgroundGradientClass: "from-purple-900/20 via-transparent to-transparent",
    selectionCardGradientClass: "from-purple-600/20 via-purple-500/10 to-transparent",
    selectionCardBorderClass: "border-purple-500/30",
    selectionCardHoverBorderClass: "hover:border-purple-400/60",
    selectionCardIconColorClass: "text-purple-400",
    reflectionGradientClass: "from-purple-900/20",
    loaderGradientFromClass: "from-purple-950",
    loaderGradientToClass: "to-background",
    loaderPulseColorClass: "bg-purple-500",
    loaderRingColorClass: "ring-purple-500/20",
    avatarBorderClass: "border-purple-500/40",
    metadataTitle: "Anxiety Sanctuary — Anonymous Emotional Support | UNMUTE",
    metadataDescription:
      "Join our anonymous Anxiety Sanctuary to talk openly about worry, racing thoughts, and unease. Connect with others who understand in a safe, judgment-free space.",
  },
  {
    id: "lonely",
    selectionLabel: "LONELY",
    selectionDescription: "Isolated, disconnected, longing",
    sanctuaryLabel: "Loneliness Sanctuary",
    sessionColor: "#3b82f6",
    roomPageTextColorClass: "text-blue-400",
    roomPageBackgroundGradientClass: "from-blue-900/20 via-transparent to-transparent",
    selectionCardGradientClass: "from-blue-600/20 via-blue-500/10 to-transparent",
    selectionCardBorderClass: "border-blue-500/30",
    selectionCardHoverBorderClass: "hover:border-blue-400/60",
    selectionCardIconColorClass: "text-blue-400",
    reflectionGradientClass: "from-blue-900/20",
    loaderGradientFromClass: "from-blue-950",
    loaderGradientToClass: "to-background",
    loaderPulseColorClass: "bg-blue-500",
    loaderRingColorClass: "ring-blue-500/20",
    avatarBorderClass: "border-blue-500/40",
    metadataTitle: "Loneliness Sanctuary — Anonymous Emotional Support | UNMUTE",
    metadataDescription:
      "Join our anonymous Loneliness Sanctuary to talk openly about isolation and disconnection. Connect with others who understand in a safe, judgment-free space.",
  },
  {
    id: "burnt-out",
    selectionLabel: "BURNT OUT",
    selectionDescription: "Exhausted, depleted, overwhelmed",
    sanctuaryLabel: "Burnout Sanctuary",
    sessionColor: "#f97316",
    roomPageTextColorClass: "text-orange-400",
    roomPageBackgroundGradientClass: "from-orange-900/20 via-transparent to-transparent",
    selectionCardGradientClass: "from-orange-600/20 via-orange-500/10 to-transparent",
    selectionCardBorderClass: "border-orange-500/30",
    selectionCardHoverBorderClass: "hover:border-orange-400/60",
    selectionCardIconColorClass: "text-orange-400",
    reflectionGradientClass: "from-orange-900/20",
    loaderGradientFromClass: "from-orange-950",
    loaderGradientToClass: "to-background",
    loaderPulseColorClass: "bg-orange-500",
    loaderRingColorClass: "ring-orange-500/20",
    avatarBorderClass: "border-orange-500/40",
    metadataTitle: "Burnout Sanctuary — Anonymous Emotional Support | UNMUTE",
    metadataDescription:
      "Join our anonymous Burnout Sanctuary to talk openly about exhaustion and overwhelm. Connect with others who understand in a safe, judgment-free space.",
  },
  {
    id: "just-talk",
    selectionLabel: "JUST WANT TO TALK",
    selectionDescription: "Need to be heard, share, connect",
    sanctuaryLabel: "Connection Sanctuary",
    sessionColor: "#10b981",
    roomPageTextColorClass: "text-emerald-400",
    roomPageBackgroundGradientClass: "from-emerald-900/20 via-transparent to-transparent",
    selectionCardGradientClass: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    selectionCardBorderClass: "border-emerald-500/30",
    selectionCardHoverBorderClass: "hover:border-emerald-400/60",
    selectionCardIconColorClass: "text-emerald-400",
    reflectionGradientClass: "from-emerald-900/20",
    loaderGradientFromClass: "from-emerald-950",
    loaderGradientToClass: "to-background",
    loaderPulseColorClass: "bg-emerald-500",
    loaderRingColorClass: "ring-emerald-500/20",
    avatarBorderClass: "border-emerald-500/40",
    metadataTitle: "Connection Sanctuary — Anonymous Emotional Support | UNMUTE",
    metadataDescription:
      "Join our anonymous Connection Sanctuary when you just need to talk. Connect with others who understand in a safe, judgment-free space.",
  },
] as const

export type RoomConfig = (typeof ROOM_CONFIGS)[number]
export type RoomId = RoomConfig["id"]

export const DEFAULT_ROOM_ID: RoomId = ROOM_CONFIGS[0].id

export const ROOM_IDS = ROOM_CONFIGS.map((room) => room.id) as RoomId[]

const ROOM_CONFIG_BY_ID: Record<RoomId, RoomConfig> = Object.fromEntries(
  ROOM_CONFIGS.map((room) => [room.id, room]),
) as Record<RoomId, RoomConfig>

export function isValidRoomId(value: string): value is RoomId {
  return ROOM_IDS.includes(value as RoomId)
}

export function getRoomConfig(roomId?: string | null): RoomConfig {
  if (!roomId || !isValidRoomId(roomId)) {
    return ROOM_CONFIG_BY_ID[DEFAULT_ROOM_ID]
  }
  return ROOM_CONFIG_BY_ID[roomId]
}
