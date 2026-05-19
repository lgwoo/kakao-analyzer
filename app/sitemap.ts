import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kakao-analyzer-seven.vercel.app",
      lastModified: new Date("2026-05-19"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://kakao-analyzer-seven.vercel.app/result",
      lastModified: new Date("2026-05-19"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
