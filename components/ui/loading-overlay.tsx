import React from "react";
import Image from "next/image";

interface LoadingOverlayProps {
  message?: string;
  isVisible?: boolean;
}

export default function LoadingOverlay({
  message = "Initializing system...",
  isVisible = true,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Animated Logo Container */}
        <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
          {/* Outer scanning ring */}
          <div
            className="absolute inset-0 w-full h-full rounded-full border-2 border-blue-500/20 animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>

          {/* Middle pulse ring */}
          <div className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] rounded-full border border-blue-400/30 animate-pulse"></div>

          {/* Inner rotating segments */}
          <div
            className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)] rounded-full border-l-2 border-t-2 border-blue-400 animate-spin"
            style={{ animationDuration: "2s" }}
          ></div>

          {/* Core logo */}
          <Image
            src="/logo.png"
            alt="DeepCheck Icon"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />

          {/* Corner brackets for tech feel - better positioned */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-l-2 border-t-2 border-blue-400/60 animate-pulse"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 border-r-2 border-t-2 border-blue-400/60 animate-pulse"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 border-l-2 border-b-2 border-blue-400/60 animate-pulse"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-r-2 border-b-2 border-blue-400/60 animate-pulse"></div>
        </div>

        {/* Brand name with better typography */}
        <div className="space-y-3">
          <h1 className="font-mono font-bold text-3xl sm:text-4xl text-blue-400 tracking-wider">
            DEEP<span className="text-blue-300">CHECK</span>
          </h1>
          <p className="text-base text-blue-200/80 font-mono tracking-wide">
            Detection System
          </p>
        </div>

        {/* Loading message with scanning animation */}
        <div className="space-y-6">
          <p className="font-mono text-blue-100 text-lg sm:text-xl tracking-wide px-4">
            {message}
          </p>
        </div>

        {/* Neural network visualization - improved positioning */}
        <div className="relative w-full max-w-xs h-10 mx-auto opacity-70">
          <div className="flex items-center justify-between">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative flex items-center">
                <div
                  className="w-3 h-3 bg-blue-400/80 rounded-full animate-ping shadow-lg shadow-blue-400/30"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: "2.5s",
                  }}
                />
                {i < 5 && (
                  <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-blue-400/60 to-blue-400/20 ml-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional tech elements */}
        <div className="flex justify-center space-x-8 opacity-40">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"></div>
          <div
            className="w-px h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-px h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dataStream {
          0%,
          100% {
            opacity: 0.3;
            transform: rotate(var(--rotation)) translateY(-28px) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: rotate(var(--rotation)) translateY(-35px) scale(1.2);
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }

        @media (max-width: 480px) {
          .space-y-8 > * + * {
            margin-top: 1.5rem;
          }
          .space-y-6 > * + * {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
