import { useId } from "react";

/** Dorado de la línea ALKO Exclusiva (sello, filetes y detalles de su plantilla). */
export const EXCLUSIVE_GOLD = "#c6a66b";

/**
 * Sello circular «ALKO Exclusiva»: texto en círculo entre dos filetes y una «A» en el centro.
 * `tone="light"` para fondos oscuros o fotos; `tone="dark"` para fondos claros.
 */
export default function ExclusiveSeal({
  size = 112,
  tone = "light",
  className = "",
}: {
  size?: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const pathId = `seal-${useId().replace(/:/g, "")}`;
  const ink = tone === "light" ? "#ffffff" : "#1c1917";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="ALKO Exclusiva"
      className={className}
    >
      <defs>
        <path id={pathId} d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke={EXCLUSIVE_GOLD} strokeWidth="0.8" />
      <circle cx="60" cy="60" r="52.5" fill="none" stroke={EXCLUSIVE_GOLD} strokeWidth="0.4" opacity="0.7" />
      <circle cx="60" cy="60" r="33" fill="none" stroke={EXCLUSIVE_GOLD} strokeWidth="0.4" opacity="0.7" />
      <text
        fill={ink}
        fontSize="9"
        letterSpacing="2.6"
        style={{ fontFamily: "var(--font-eb-garamond), Georgia, serif" }}
      >
        {/* El texto ocupa justo la circunferencia (2π·43): así no se monta en la unión. */}
        <textPath href={`#${pathId}`} startOffset="0" textLength="268" lengthAdjust="spacingAndGlyphs">
          ALKO · EXCLUSIVA · ALKO · EXCLUSIVA ·
        </textPath>
      </text>
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fill={EXCLUSIVE_GOLD}
        fontSize="30"
        style={{ fontFamily: "var(--font-eb-garamond), Georgia, serif" }}
      >
        A
      </text>
      <line x1="50" y1="77" x2="70" y2="77" stroke={EXCLUSIVE_GOLD} strokeWidth="0.5" />
    </svg>
  );
}
