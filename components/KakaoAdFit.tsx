"use client";

import { useEffect, useRef } from "react";

interface Props {
  unitId: string;
  width: number;
  height: number;
}

export default function KakaoAdFit({ unitId, width, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", unitId);
    ins.setAttribute("data-ad-width", String(width));
    ins.setAttribute("data-ad-height", String(height));
    container.appendChild(ins);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [unitId, width, height]);

  return (
    <div className="flex justify-center my-2">
      <div ref={containerRef} style={{ width, minHeight: height }} />
    </div>
  );
}
