import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            marginBottom: 24,
          }}
        >
          💬
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
            letterSpacing: "-1px",
          }}
        >
          카톡 대화 분석기
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          카카오톡 대화 파일을 업로드하면 메시지 수,
          답장 속도, 자주 쓰는 단어를 무료로 분석해드려요
        </div>
        <div
          style={{
            marginTop: 40,
            padding: "12px 32px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: 999,
            color: "#ffffff",
            fontSize: 22,
          }}
        >
          kakao-analyzer-seven.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
