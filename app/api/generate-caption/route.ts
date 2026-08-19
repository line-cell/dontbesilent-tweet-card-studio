import fs from "node:fs";
import path from "node:path";

type CaptionRequest = {
  topic?: unknown;
  tags?: unknown;
};

type CaptionPoolItem = {
  caption?: unknown;
};

const CAPTION_POOL_PATHS = [
  path.join(process.cwd(), "public", "captions.json"),
  path.resolve(import.meta.dirname, "../../../public/captions.json"),
];
const GLOBAL_TAGS = ["创业", "认知", "自媒体", "认知觉醒", "商业思维", "成长", "执行力", "赚钱思维", "内容创作"];
const TOPIC_TAGS: Record<string, string[]> = {
  "商业与产品": ["创业", "商业思维", "赚钱思维", "产品思维", "生意"],
  "产品与商业": ["创业", "商业思维", "产品思维", "变现", "生意"],
  "AI 与工具": ["AI", "效率", "工具", "创业", "内容创作"],
  "内容与传播": ["自媒体", "内容创作", "流量", "创业", "商业思维"],
  "认知与语言": ["认知", "认知觉醒", "表达", "成长", "思维"],
  "哲学与认知": ["认知", "认知觉醒", "思维", "成长", "表达"],
  "行动与心理": ["执行力", "成长", "内耗", "自我提升", "认知"],
  "学习与教育": ["成长", "认知", "执行力", "学习", "自我提升"],
  "个人经历": ["成长", "经历", "认知", "自我提升", "记录"],
  "市场与社会": ["商业观察", "趋势", "认知", "创业", "社会"],
};

export const runtime = "nodejs";
export const maxDuration = 3;

export async function POST(request: Request) {
  const captions = loadCaptionPool();
  if (captions.length === 0) {
    return jsonError("文案池为空，请先生成 captions.json。", 503);
  }

  let body: CaptionRequest = {};
  try {
    body = (await request.json()) as CaptionRequest;
  } catch {
    body = {};
  }

  const caption = captions[Math.floor(Math.random() * captions.length)] || captions[0];
  const hashtags = buildHashtags(body.topic, body.tags);
  return Response.json(
    {
      caption: formatCaption(caption.caption || "", hashtags),
      hashtags,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function loadCaptionPool() {
  try {
    const poolPath = CAPTION_POOL_PATHS.find((candidate) => fs.existsSync(candidate));
    if (!poolPath) return [];
    const raw = fs.readFileSync(poolPath, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((item): item is CaptionPoolItem => typeof item === "string" || (typeof item === "object" && item !== null))
      .map((item) => (typeof item === "string" ? { caption: item } : item))
      .filter((item) => typeof item.caption === "string")
      .map((item) => ({ caption: String(item.caption).trim() }))
      .filter((item) => {
        const length = Array.from(item.caption || "").length;
        return length >= 30 && length <= 40;
      });
  } catch {
    return [];
  }
}

function buildHashtags(topic: unknown, tags: unknown) {
  const merged: string[] = [];
  const rawTags = Array.isArray(tags) ? tags : [];
  const topicKey = typeof topic === "string" ? topic.trim() : "";
  const topicTags = topicKey ? TOPIC_TAGS[topicKey] || [] : [];

  for (const source of [...rawTags, ...topicTags, ...GLOBAL_TAGS]) {
    if (typeof source !== "string") continue;
    const cleaned = cleanTag(source);
    if (!cleaned || merged.includes(cleaned)) continue;
    merged.push(cleaned);
    if (merged.length >= 5) break;
  }

  while (merged.length < 3) {
    const fallback = GLOBAL_TAGS[merged.length] || "认知";
    const cleaned = cleanTag(fallback);
    if (!merged.includes(cleaned)) merged.push(cleaned);
  }

  return merged.slice(0, 5);
}

function cleanTag(value: string) {
  return value
    .replace(/^#+/, "")
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}_]/gu, "")
    .slice(0, 12);
}

function formatCaption(caption: string, hashtags: string[]) {
  return [caption, hashtags.map((tag) => `#${tag}`).join(" ")].filter(Boolean).join("\n\n");
}

function jsonError(message: string, status: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
