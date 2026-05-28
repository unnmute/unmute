"use client"

import { useEffect, useRef, useState } from "react"

const GIGGLE_TEXTS = ["hehe 🫣", "teehee~", "stop it! 😳", "hehehe", "*giggling*"]

export function MiraCharacter() {
  const armRef = useRef<SVGGElement>(null)
  const [isGiggling, setIsGiggling] = useState(false)
  const [giggleText, setGiggleText] = useState("hehe 🫣")

  useEffect(() => {
    const t = setTimeout(() => {
      if (armRef.current) {
        armRef.current.style.animation = "mirWave 2s ease-in-out 0s 2"
      }
    }, 1000)

    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    if (isGiggling) return

    const text = GIGGLE_TEXTS[Math.floor(Math.random() * GIGGLE_TEXTS.length)]
    setGiggleText(text)
    setIsGiggling(true)

    setTimeout(() => {
      setIsGiggling(false)
    }, 2200)
  }

  return (
    <div className="flex flex-col items-center">
      <style>{`
        @keyframes mirFloat {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes mirWave {
          0%,100% { transform: rotate(0deg); transform-origin: 20px 20px; }
          20% { transform: rotate(-20deg); transform-origin: 20px 20px; }
          40% { transform: rotate(15deg); transform-origin: 20px 20px; }
          60% { transform: rotate(-15deg); transform-origin: 20px 20px; }
          80% { transform: rotate(10deg); transform-origin: 20px 20px; }
        }
        @keyframes mirBlink {
          0%,88%,100% { transform: scaleY(1); }
          93% { transform: scaleY(0.05); }
        }
        @keyframes mirGlow {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes mirBob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes mirShadow {
          0%,100% { transform: scaleX(1); opacity: 0.15; }
          50% { transform: scaleX(0.85); opacity: 0.08; }
        }
        @keyframes mirThumb {
          0%,100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes mirGiggle {
          0%,100% { transform: translateX(0px); }
          15% { transform: translateX(-4px); }
          30% { transform: translateX(4px); }
          45% { transform: translateX(-3px); }
          60% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        @keyframes mirSpeechPop {
          0% { opacity: 0; transform: scale(0.5) translateY(8px); }
          20% { opacity: 1; transform: scale(1.05) translateY(0px); }
          80% { opacity: 1; transform: scale(1) translateY(0px); }
          100% { opacity: 0; transform: scale(0.9) translateY(-4px); }
        }
        @keyframes mirEyeSquish {
          0%,100% { transform: scaleY(1); }
          50% { transform: scaleY(0.15); }
        }
        @keyframes mirArmRaiseLeft {
          0%,100% { transform: rotate(0deg) translateY(0px); transform-origin: 30px 130px; }
          30%,70% { transform: rotate(-70deg) translateY(-20px); transform-origin: 30px 130px; }
        }
        @keyframes mirArmRaiseRight {
          0%,100% { transform: rotate(0deg) translateY(0px); transform-origin: 150px 130px; }
          30%,70% { transform: rotate(70deg) translateY(-20px); transform-origin: 150px 130px; }
        }
        .mir-float { animation: mirFloat 3.5s ease-in-out infinite; }
        .mir-blink { animation: mirBlink 4s ease-in-out infinite; }
        .mir-blink-r { animation: mirBlink 4s ease-in-out infinite; animation-delay: 0.08s; }
        .mir-glow { animation: mirGlow 2s ease-in-out infinite; }
        .mir-bob { animation: mirBob 3.5s ease-in-out infinite; }
        .mir-shadow { animation: mirShadow 3.5s ease-in-out infinite; }
        .mir-thumb { animation: mirThumb 2s ease-in-out infinite; }
      `}</style>

      <svg
        className="cursor-pointer"
        width="180"
        height="240"
        viewBox="0 0 180 240"
        onClick={handleClick}
        style={{ filter: "drop-shadow(0 12px 24px rgba(139,92,246,0.25))", overflow: "visible" }}
      >
        <g className="mir-float">
          <g
            style={{
              animation: isGiggling ? "mirSpeechPop 2.2s ease forwards" : "none",
              display: isGiggling ? "block" : "none",
            }}
          >
            {/* Bubble */}
            <rect x="52" y="-18" width="76" height="28" rx="14" fill="#1e1640" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
            {/* Tail */}
            <path d="M 82 10 L 78 18 L 90 10" fill="#1e1640" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
            {/* Text */}
            <text x="90" y="-1" textAnchor="middle" fontSize="12" fill="rgba(167,139,250,0.9)" fontFamily="sans-serif">
              {giggleText}
            </text>
          </g>

          <g style={{ animation: isGiggling ? "mirGiggle 0.4s ease-in-out 4" : "none" }}>
            {/* LEGS */}
            <rect x="62" y="188" width="22" height="30" rx="11" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
            <rect x="96" y="188" width="22" height="30" rx="11" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
            <ellipse cx="73" cy="220" rx="15" ry="8" fill="#1e1640" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
            <ellipse cx="107" cy="220" rx="15" ry="8" fill="#1e1640" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />

            {/* BODY */}
            <rect x="48" y="128" width="84" height="68" rx="20" fill="#1e1640" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
            <rect x="66" y="142" width="48" height="32" rx="8" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />
            <circle cx="90" cy="158" r="8" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
            <circle cx="90" cy="158" r="4" fill="rgba(167,139,250,0.7)" className="mir-glow" />

            {/* WAVE ARM */}
            <g ref={armRef} style={{ animation: isGiggling ? "mirArmRaiseLeft 2.2s ease forwards" : undefined }}>
              <rect x="10" y="130" width="18" height="40" rx="9" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" transform="rotate(-15, 19, 135)" />
              <circle cx="16" cy="167" r="7" fill="#1e1640" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
              <rect x="8" y="162" width="16" height="32" rx="8" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" transform="rotate(20, 16, 170)" />
              <ellipse cx="20" cy="194" rx="11" ry="9" fill="#2a1f4e" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" transform="rotate(20, 20, 194)" />
              <line x1="12" y1="190" x2="10" y2="183" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17" y1="188" x2="15" y2="181" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="188" x2="22" y2="181" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="27" y1="190" x2="29" y2="183" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* THUMB ARM */}
            <g style={{ animation: isGiggling ? "mirArmRaiseRight 2.2s ease forwards" : "mirThumb 2s ease-in-out infinite" }}>
              <rect x="152" y="132" width="18" height="38" rx="9" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" transform="rotate(15, 161, 137)" />
              <circle cx="164" cy="166" r="7" fill="#1e1640" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
              <rect x="154" y="160" width="16" height="28" rx="8" fill="#2a1f4e" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" transform="rotate(-10, 162, 168)" />
              <rect x="154" y="183" width="22" height="18" rx="9" fill="#2a1f4e" stroke="rgba(139,92,246,0.45)" strokeWidth="1.5" />
              <rect x="158" y="172" width="10" height="16" rx="5" fill="#2a1f4e" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" />
            </g>

            {/* NECK */}
            <rect x="80" y="120" width="20" height="14" rx="5" fill="#1e1640" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />

            {/* HEAD */}
            <ellipse cx="90" cy="90" rx="52" ry="54" fill="#1e1640" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" />
            <ellipse cx="75" cy="60" rx="20" ry="12" fill="rgba(255,255,255,0.04)" transform="rotate(-20,75,60)" />

            {/* FACE SCREEN */}
            <rect x="44" y="62" width="92" height="60" rx="22" fill="#0d0a1f" stroke="rgba(139,92,246,0.6)" strokeWidth="1.5" />

            {isGiggling ? (
              <>
                {/* GIGGLE EYES */}
                <path d="M 56 88 Q 70 78 84 88" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="3" strokeLinecap="round" />
                <path d="M 96 88 Q 110 78 124 88" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* LEFT EYE */}
                <g className="mir-blink">
                  <circle cx="70" cy="88" r="18" fill="#0d0a1f" />
                  <circle cx="70" cy="88" r="16" fill="none" stroke="rgba(139,92,246,0.8)" strokeWidth="2.5" className="mir-glow" />
                  <circle cx="70" cy="88" r="7" fill="rgba(167,139,250,0.9)" />
                  <circle cx="70" cy="88" r="4" fill="rgba(88,28,135,1)" />
                  <circle cx="67" cy="85" r="2" fill="rgba(255,255,255,0.8)" />
                </g>

                {/* RIGHT EYE */}
                <g className="mir-blink-r">
                  <circle cx="110" cy="88" r="18" fill="#0d0a1f" />
                  <circle cx="110" cy="88" r="16" fill="none" stroke="rgba(139,92,246,0.8)" strokeWidth="2.5" className="mir-glow" />
                  <circle cx="110" cy="88" r="7" fill="rgba(167,139,250,0.9)" />
                  <circle cx="110" cy="88" r="4" fill="rgba(88,28,135,1)" />
                  <circle cx="107" cy="85" r="2" fill="rgba(255,255,255,0.8)" />
                </g>
              </>
            )}

            {/* SMILE */}
            <path d="M 76 110 Q 90 122 104 110" fill="none" stroke="rgba(167,139,250,0.7)" strokeWidth="2.5" strokeLinecap="round" />

            {/* ANTENNA */}
            <g className="mir-bob">
              <line x1="90" y1="36" x2="90" y2="18" stroke="rgba(139,92,246,0.6)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="90" cy="14" r="6" fill="rgba(139,92,246,0.3)" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5" />
              <circle cx="90" cy="14" r="3" fill="rgba(167,139,250,0.9)" className="mir-glow" />
            </g>

            {/* EARS */}
            <circle cx="38" cy="88" r="8" fill="#1e1640" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
            <circle cx="38" cy="88" r="4" fill="rgba(139,92,246,0.2)" />
            <circle cx="142" cy="88" r="8" fill="#1e1640" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5" />
            <circle cx="142" cy="88" r="4" fill="rgba(139,92,246,0.2)" />
          </g>
        </g>
      </svg>

      {/* Shadow */}
      <div
        className="mir-shadow -mt-1 h-3 w-20 rounded-full"
        style={{ background: "rgba(139,92,246,0.2)", filter: "blur(6px)" }}
      />
    </div>
  )
}
