import React, { useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

interface BadgeQRProps {
  name?: string;
  role?: string;
  stack?: string | string[];
  id?: string;
  payload?: string | object;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  useCanvas?: boolean;
  className?: string;
  uniqueKey?: string;
}

export const BadgeQR: React.FC<BadgeQRProps> = ({
  name = "Builder",
  role = "Dev",
  stack = [],
  id = "GOA-2026",
  payload,
  size = 130,
  fgColor = "#38BDF8",
  bgColor = "#020617",
  useCanvas = false,
  className = "",
  uniqueKey,
}) => {
  const [hasError] = useState(false);

  const parsedStack = Array.isArray(stack)
    ? stack
    : typeof stack === "string" && stack
    ? (stack as string).split(",").map((s) => s.trim())
    : [];

  const formattedPayload =
    typeof payload === "string"
      ? payload
      : JSON.stringify(
          payload || {
            name: name || "Builder",
            role: role || "Dev",
            stack: parsedStack,
            id: id || "GOA-2026",
          }
        );

  const componentKey = uniqueKey || `badge-qr-${id}-${name.replace(/\s+/g, '_')}`;

  if (hasError) {
    return (
      <div
        key={componentKey}
        className={`p-2 rounded-2xl border flex items-center justify-center ${className}`}
        style={{ width: size, height: size, backgroundColor: bgColor, borderColor: fgColor }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill={fgColor}>
          <rect x="10" y="10" width="25" height="25" />
          <rect x="15" y="15" width="15" height="15" fill={bgColor} />
          <rect x="18" y="18" width="9" height="9" fill={fgColor} />

          <rect x="65" y="10" width="25" height="25" />
          <rect x="70" y="15" width="15" height="15" fill={bgColor} />
          <rect x="73" y="18" width="9" height="9" fill={fgColor} />

          <rect x="10" y="65" width="25" height="25" />
          <rect x="15" y="70" width="15" height="15" fill={bgColor} />
          <rect x="18" y="73" width="9" height="9" fill={fgColor} />

          <rect x="45" y="45" width="10" height="10" />
          <rect x="60" y="45" width="10" height="10" />
          <rect x="45" y="60" width="10" height="10" />
          <rect x="65" y="65" width="20" height="20" />
        </svg>
      </div>
    );
  }

  return (
    <div
      key={componentKey}
      className={`p-2 rounded-2xl border border-sky-500/30 inline-flex items-center justify-center shadow-lg ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {useCanvas ? (
        <QRCodeCanvas
          value={formattedPayload}
          size={size - 16}
          fgColor={fgColor}
          bgColor={bgColor}
          level="M"
        />
      ) : (
        <QRCodeSVG
          value={formattedPayload}
          size={size - 16}
          fgColor={fgColor}
          bgColor={bgColor}
          level="M"
        />
      )}
    </div>
  );
};
