"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
}

export default function GoogleAd({ slot, format = "auto" }: Props) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className="flex justify-center my-4">
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9164464986285830"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
