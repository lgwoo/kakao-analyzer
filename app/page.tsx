"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { parseKakaoTxt } from "@/lib/parser";
import { analyze } from "@/lib/analyzer";

export default function Home() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function processFile(file: File) {
    if (!file.name.endsWith(".txt")) {
      setError("카카오톡 대화 내보내기 .txt 파일만 지원합니다.");
      return;
    }
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const messages = parseKakaoTxt(text);
        if (messages.length === 0) {
          setError("메시지를 찾지 못했습니다. 카카오톡 내보내기 파일인지 확인해주세요.");
          setLoading(false);
          return;
        }
        const result = analyze(messages);
        sessionStorage.setItem("kakao-result", JSON.stringify(result));
        router.push("/result");
      } catch {
        setError("파일 분석 중 오류가 발생했습니다. 올바른 카카오톡 내보내기 파일인지 확인해주세요.");
        setLoading(false);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">카톡 대화 분석기</h1>
          <p className="text-gray-500 text-base">
            카카오톡 대화 내보내기 파일을 업로드하면<br />
            누가 말이 많은지, 언제 가장 활발한지 분석해드려요
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
            ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30"}`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input id="file-input" type="file" accept=".txt" className="hidden" onChange={onFileChange} />
          <div className="text-4xl mb-3">{loading ? "⏳" : "📂"}</div>
          {loading ? (
            <p className="text-indigo-600 font-medium">분석 중...</p>
          ) : (
            <>
              <p className="font-semibold text-gray-700 mb-1">파일을 드래그하거나 클릭해서 업로드</p>
              <p className="text-sm text-gray-400">.txt 파일만 지원 (카카오톡 내보내기)</p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="font-semibold text-gray-700 mb-3 text-sm">카카오톡 대화 내보내기 방법</p>
          <ol className="text-sm text-gray-500 space-y-1.5 list-decimal list-inside">
            <li>카카오톡 채팅방 우상단 <strong>≡</strong> 메뉴 열기</li>
            <li>오른쪽 상단 <strong>⋮</strong> → <strong>대화 내보내기</strong></li>
            <li><strong>텍스트로 내보내기</strong> 선택 후 저장</li>
          </ol>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 모든 분석은 브라우저 내에서만 처리됩니다. 서버로 전송되지 않아요.
        </p>
      </div>
    </main>
  );
}
