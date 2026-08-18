"use client";

/* eslint-disable @next/next/no-img-element */

import {
  Bookmark,
  Check,
  Copy,
  Download,
  Heart,
  Image as ImageIcon,
  Link2,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Moon,
  Move,
  RefreshCw,
  Repeat2,
  Search,
  Share2,
  Shuffle,
  Sun,
  Upload,
} from "lucide-react";
import { toPng } from "html-to-image";
import {
  CSSProperties,
  ForwardedRef,
  PointerEvent as ReactPointerEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Metrics = {
  comments?: string;
  reposts?: string;
  likes?: string;
  views?: string;
  bookmarks?: string;
};

type Post = {
  id: string;
  date: string;
  kind: string;
  text: string;
  sourceUrl: string;
  topic: string;
  format: string;
  tags: string[];
  metrics: Metrics | null;
};

type Background = {
  id: string;
  name: string;
  src: string;
  keywords: string;
};

type Category = {
  id: string;
  label: string;
  topics: string[];
};

const FALLBACK_POSTS: Post[] = [
  {
    id: "2032893859311792148",
    date: "2026-03-15",
    kind: "主贴",
    text: "一个人可以拥有稳定职业、社会地位和物质基础，但仍然在一种意义上“浪费生命”，因为他的行动轨迹不再围绕自己的欲望，而是围绕社会要求他如何欲望。",
    sourceUrl: "https://x.com/dontbesilent/status/2032893859311792148",
    topic: "人生选择",
    format: "观点",
    tags: ["人生选择", "成长", "认知提升"],
    metrics: {
      comments: "7",
      reposts: "18",
      likes: "153",
      views: "1.1万",
      bookmarks: "58",
    },
  },
];

const BACKGROUNDS: Background[] = [
  { id: "misty", name: "雾谷晨光", src: "/backgrounds/misty-valley.jpeg", keywords: "山谷 自然 清晨 雾" },
  { id: "mountain", name: "山野远景", src: "/backgrounds/mountain-valley.jpeg", keywords: "山野 自然 蓝天" },
  { id: "harbor", name: "海港蓝调", src: "/backgrounds/harbor-blue.jpeg", keywords: "香港 海港 城市 蓝调" },
  { id: "street", name: "城市夜行", src: "/backgrounds/city-night.jpeg", keywords: "城市 夜景 街头" },
  { id: "skyline", name: "天际线", src: "/backgrounds/skyline.jpeg", keywords: "城市 高楼 天际线" },
  { id: "peak", name: "群山云海", src: "/backgrounds/cloud-mountain.jpeg", keywords: "群山 云海 自然" },
  { id: "coast", name: "海岸公路", src: "/backgrounds/coast-road.jpeg", keywords: "海岸 公路 旅行" },
  { id: "forest", name: "森林微光", src: "/backgrounds/forest-light.jpeg", keywords: "森林 自然 绿色" },
];

const CATEGORIES: Category[] = [
  { id: "all", label: "全部", topics: [] },
  { id: "business", label: "商业产品", topics: ["商业与产品", "产品与商业"] },
  { id: "ai", label: "AI 工具", topics: ["AI 与工具"] },
  { id: "content", label: "内容传播", topics: ["内容与传播"] },
  { id: "thinking", label: "认知思考", topics: ["认知与语言", "哲学与认知"] },
  { id: "action", label: "行动成长", topics: ["行动与心理", "学习与教育", "个人经历"] },
  { id: "market", label: "市场社会", topics: ["市场与社会"] },
];

const CAPTION_LEADS = [
  "有些答案并不复杂，真正难的是愿不愿意面对。",
  "把这件事想清楚，很多动作自然就简单了。",
  "今天留下一条值得反复看的思考。",
  "人与人真正拉开差距的，往往不是信息本身。",
  "换一个视角看，原本纠结的问题会清楚很多。",
  "越是看起来理所当然的事，越值得重新想一遍。",
  "这段话不一定让人舒服，但可能很有用。",
  "很多问题不是没有答案，而是答案不符合期待。",
];

const CAPTION_ENDINGS = [
  "你怎么看？",
  "先记下来，过一段时间再回来看看。",
  "分享给同样在认真做事的人。",
  "真正做过之后，会有不一样的理解。",
  "评论区聊聊你的判断。",
  "知易行难，答案最终还在行动里。",
];

function XLogo({ size = 20 }: { size?: number }) {
  return (
    <svg aria-label="X" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge({ size = 19 }: { size?: number }) {
  return (
    <svg aria-label="认证账号" viewBox="0 0 22 22" width={size} height={size}>
      <path
        fill="#1d9bf0"
        d="M20.396 11c0 1.006-1.067 1.76-1.309 2.69-.248.963.313 2.145-.158 2.958-.478.826-1.79.945-2.46 1.615-.67.67-.79 1.982-1.616 2.46-.813.47-1.995-.09-2.958.158-.93.242-1.684 1.309-2.69 1.309-1.006 0-1.76-1.067-2.69-1.309-.963-.248-2.145.313-2.958-.158-.826-.478-.945-1.79-1.615-2.46-.67-.67-1.982-.79-2.46-1.616-.47-.813.09-1.995-.158-2.958C.082 12.76-.985 12.006-.985 11c0-1.006 1.067-1.76 1.309-2.69.248-.963-.313-2.145.158-2.958.478-.826 1.79-.945 2.46-1.615.67-.67.79-1.982 1.616-2.46.813-.47 1.995.09 2.958-.158C8.445.877 9.2-.19 10.205-.19c1.006 0 1.76 1.067 2.69 1.309.963.248 2.145-.313 2.958.158.826.478.945 1.79 1.615 2.46.67.67 1.982.79 2.46 1.616.47.813-.09 1.995.158 2.958.242.93 1.309 1.684 1.309 2.69Z"
        transform="translate(.795)"
      />
      <path fill="#fff" d="m9.72 14.78-3.33-3.33 1.28-1.28 2.01 2.01 4.62-5.03 1.34 1.24-5.92 6.39Z" />
    </svg>
  );
}

function seededNumber(key: string, min: number, max: number) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return min + ((hash >>> 0) % (max - min + 1));
}

function formatMetric(value: number) {
  if (value >= 10000) {
    const wan = value / 10000;
    return `${wan >= 100 ? Math.round(wan) : wan.toFixed(1).replace(/\.0$/, "")}万`;
  }
  return value.toLocaleString("en-US");
}

function syntheticMetrics(post: Post, variant: number) {
  const key = `${post.id}:${variant}`;
  const likes = seededNumber(`${key}:likes`, 2200, 9800);
  return {
    comments: formatMetric(seededNumber(`${key}:comments`, 48, 680)),
    reposts: formatMetric(seededNumber(`${key}:reposts`, 180, 1680)),
    likes: formatMetric(likes),
    views: formatMetric(Math.max(likes * 42, seededNumber(`${key}:views`, 160000, 980000))),
    bookmarks: formatMetric(seededNumber(`${key}:bookmarks`, 620, 4600)),
  };
}

function displayDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function displayLongDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function shortText(text: string, length = 76) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > length ? `${normalized.slice(0, length)}…` : normalized;
}

function safeFileName(post: Post) {
  return `dontbesilent-${post.date}-${post.id.slice(-6)}.png`;
}

function makeCaption(post: Post, variant = 0) {
  const lead = CAPTION_LEADS[seededNumber(`${post.id}:caption-lead:${variant}`, 0, CAPTION_LEADS.length - 1)];
  const ending = CAPTION_ENDINGS[seededNumber(`${post.id}:caption-ending:${variant}`, 0, CAPTION_ENDINGS.length - 1)];
  const tags = [...new Set([post.topic, ...post.tags])].slice(0, 3);
  return `${lead}\n\n${ending}\n\n${tags.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")}`;
}

function makeRandomCaption(post: Post) {
  return makeCaption(post, Date.now() + Math.random());
}

function makeDifferentCaption(post: Post, current: string) {
  const seed = Date.now();
  for (let offset = 0; offset < 12; offset += 1) {
    const candidate = makeCaption(post, seed + offset);
    if (candidate !== current) return candidate;
  }
  return makeCaption(post, seed + 37);
}

function postMatchesCategory(post: Post, categoryId: string) {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return !category || category.id === "all" || category.topics.includes(post.topic);
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function waitForImage(image: HTMLImageElement) {
  if (!image.complete || image.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => reject(new Error("图片加载失败")), { once: true });
    });
  }
  if (typeof image.decode === "function") await image.decode();
}

async function inlineImages(target: HTMLElement) {
  const images = Array.from(target.querySelectorAll("img"));
  const replacements: Array<{ image: HTMLImageElement; originalSrc: string; dataUrl: string }> = [];

  for (const image of images) {
    await waitForImage(image);
    const originalSrc = image.getAttribute("src") || "";
    const resolvedSrc = image.currentSrc || image.src;
    if (!resolvedSrc || resolvedSrc.startsWith("data:")) continue;

    const response = await fetch(resolvedSrc, { cache: "force-cache" });
    if (!response.ok) throw new Error("图片读取失败");
    const dataUrl = await blobToDataUrl(await response.blob());
    replacements.push({ image, originalSrc, dataUrl });
  }

  for (const replacement of replacements) {
    replacement.image.src = replacement.dataUrl;
    await waitForImage(replacement.image);
  }

  return () => replacements.reverse().forEach(({ image, originalSrc }) => image.setAttribute("src", originalSrc));
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);
  const [selectedId, setSelectedId] = useState(FALLBACK_POSTS[0].id);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleLimit, setVisibleLimit] = useState(120);
  const [contentMode, setContentMode] = useState<"archive" | "edit">("archive");
  const [editedText, setEditedText] = useState(FALLBACK_POSTS[0].text);
  const [outputMode, setOutputMode] = useState<"douyin" | "card">("douyin");
  const [cardTheme, setCardTheme] = useState<"light" | "dark">("light");
  const [metricVariant, setMetricVariant] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0]);
  const [backgroundQuery, setBackgroundQuery] = useState("");
  const [remoteBackground, setRemoteBackground] = useState("");
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [dim, setDim] = useState(16);
  const [cardScale, setCardScale] = useState(90);
  const [bodySize, setBodySize] = useState(18);
  const [cardOpacity, setCardOpacity] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [caption, setCaption] = useState(makeCaption(FALLBACK_POSTS[0]));
  const [copyLabel, setCopyLabel] = useState("一键复制");
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const artboardRef = useRef<HTMLDivElement>(null);
  const tweetCardRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ active: false, clientX: 0, clientY: 0, x: 0, y: 0 });

  useEffect(() => {
    fetch("/posts.json")
      .then((response) => {
        if (!response.ok) throw new Error("素材库读取失败");
        return response.json();
      })
      .then((data: Post[]) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setPosts(data);
        setSelectedId(data[0].id);
        setEditedText(data[0].text);
        setCaption(makeRandomCaption(data[0]));
      })
      .catch(() => setLoadError("正在使用内置示例，刷新后可重试。"));
  }, []);

  const selected = useMemo(
    () => posts.find((post) => post.id === selectedId) || posts[0] || FALLBACK_POSTS[0],
    [posts, selectedId],
  );

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (!postMatchesCategory(post, activeCategory)) return false;
      return keyword
        ? [post.text, post.topic, post.tags.join(" "), post.date]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;
    });
  }, [posts, query, activeCategory]);

  const categoryCounts = useMemo(() => Object.fromEntries(
    CATEGORIES.map((category) => [
      category.id,
      category.id === "all" ? posts.length : posts.filter((post) => postMatchesCategory(post, category.id)).length,
    ]),
  ), [posts]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleLimit);
  }, [filteredPosts, visibleLimit]);

  const visibleBackgrounds = useMemo(() => {
    const keyword = backgroundQuery.trim().toLowerCase();
    return BACKGROUNDS.filter((item) =>
      `${item.name} ${item.keywords}`.toLowerCase().includes(keyword),
    );
  }, [backgroundQuery]);

  const backgroundSrc = customBackground || selectedBackground.src;
  const previewText = contentMode === "edit" ? editedText : selected.text;
  const effectiveBodySize = Math.max(
    12,
    bodySize - (previewText.length > 900 ? 6 : previewText.length > 650 ? 5 : previewText.length > 420 ? 3 : previewText.length > 260 ? 1 : 0),
  );

  function choosePost(post: Post) {
    setSelectedId(post.id);
    setEditedText(post.text);
    setCaption(makeRandomCaption(post));
    setPosition({ x: 0, y: 0 });
  }

  function chooseRandomPost() {
    const scopedPool = filteredPosts.filter((post) => post.id !== selected.id && post.text.length <= 900);
    const pool = scopedPool.length > 0 ? scopedPool : posts.filter((post) => post.id !== selected.id && post.text.length <= 900);
    const next = pool[Math.floor(Math.random() * pool.length)] || posts[0];
    choosePost(next);
  }

  function handleUpload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setCustomBackground(String(reader.result));
    reader.readAsDataURL(file);
  }

  function applyRemoteBackground() {
    const value = remoteBackground.trim();
    if (!/^https?:\/\//i.test(value)) return;
    setCustomBackground(value);
  }

  function startDrag(event: ReactPointerEvent<HTMLElement>) {
    if (outputMode !== "douyin") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      clientX: event.clientX,
      clientY: event.clientY,
      x: position.x,
      y: position.y,
    };
  }

  function moveDrag(event: ReactPointerEvent<HTMLElement>) {
    if (!dragRef.current.active) return;
    setPosition({
      x: dragRef.current.x + event.clientX - dragRef.current.clientX,
      y: dragRef.current.y + event.clientY - dragRef.current.clientY,
    });
  }

  function stopDrag() {
    dragRef.current.active = false;
  }

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setCopyLabel("已复制");
    window.setTimeout(() => setCopyLabel("一键复制"), 1600);
  }

  async function downloadImage() {
    const target = outputMode === "douyin" ? artboardRef.current : tweetCardRef.current;
    if (!target) return;
    setIsDownloading(true);
    let restoreImages = () => {};
    try {
      await document.fonts.ready;
      restoreImages = await inlineImages(target);
      const rect = target.getBoundingClientRect();
      const targetWidth = outputMode === "douyin" ? 1080 : Math.round(rect.width * 2);
      const pixelRatio = outputMode === "douyin" ? 1 : targetWidth / rect.width;
      const dataUrl = await toPng(target, {
        cacheBust: false,
        pixelRatio,
        canvasWidth: outputMode === "douyin" ? 1080 : undefined,
        canvasHeight: outputMode === "douyin" ? 1440 : undefined,
        backgroundColor: outputMode === "douyin" ? "#0b0b0b" : cardTheme === "light" ? "#ffffff" : "#000000",
      });
      const link = document.createElement("a");
      link.download = safeFileName(selected);
      link.href = dataUrl;
      link.click();
    } catch {
      setLoadError("图片导出失败。网络背景可能禁止下载，请改用内置图片或本地上传。 ");
    } finally {
      restoreImages();
      setIsDownloading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">DB</div>
          <div>
            <p className="eyebrow">DONTBESILENT MATRIX</p>
            <h1>抖音图文生成器</h1>
          </div>
        </div>
        <div className="status-pill"><Check size={16} /> 选内容 · 选背景 · 直接发</div>
      </header>

      <div className="workspace">
        <aside className="control-panel">
          <section className="control-section">
            <SectionHeading number="01" title="选择推文内容" subtitle="用原推，或者在原推基础上改写" />
            <div className="segmented" role="tablist" aria-label="内容模式">
              <button className={contentMode === "archive" ? "active" : ""} onClick={() => setContentMode("archive")}>历史原推</button>
              <button className={contentMode === "edit" ? "active" : ""} onClick={() => setContentMode("edit")}>编辑文案</button>
            </div>
          </section>

          {contentMode === "archive" ? (
            <section className="control-section content-library">
              <SectionHeading number="02" title={`搜索 ${posts.length.toLocaleString("zh-CN")} 条推文`} subtitle="搜关键词，点一条就能直接用" />
              <div className="search-row">
                <label className="search-box">
                  <Search size={17} />
                  <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleLimit(120); }} placeholder="例如：创业、AI、自媒体" />
                </label>
                <button className="icon-button" title="随机换一条" aria-label="随机换一条" onClick={chooseRandomPost}><Shuffle size={18} /></button>
              </div>
              <div className="category-tabs" role="group" aria-label="推文分类">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className={activeCategory === category.id ? "active" : ""}
                    onClick={() => { setActiveCategory(category.id); setVisibleLimit(120); }}
                  >
                    {category.label}<small>{categoryCounts[category.id] || 0}</small>
                  </button>
                ))}
              </div>
              <p className="filter-summary">当前筛选 {filteredPosts.length.toLocaleString("zh-CN")} 条，随机按钮只会从当前结果中抽取</p>
              <div className="post-list" role="listbox" aria-label="推文素材库">
                {visiblePosts.map((post) => (
                  <button key={post.id} className={`post-row ${post.id === selected.id ? "selected" : ""}`} onClick={() => choosePost(post)}>
                    <time>{post.date}</time>
                    <span className="post-copy"><strong>{shortText(post.text)}</strong><small>{post.topic} · {post.format}</small></span>
                  </button>
                ))}
                {visiblePosts.length === 0 && <div className="empty-state">没有找到，换个关键词试试。</div>}
              </div>
              {visiblePosts.length < filteredPosts.length && (
                <button className="load-more-button" onClick={() => setVisibleLimit((limit) => limit + 120)}>
                  再加载 120 条
                </button>
              )}
              {loadError && <p className="inline-notice">{loadError}</p>}
            </section>
          ) : (
            <section className="control-section editor-section">
              <SectionHeading number="02" title="编辑当前文案" subtitle="只改这次成品，不影响原始素材库" />
              <textarea value={editedText} onChange={(event) => setEditedText(event.target.value)} rows={11} />
              <div className="text-count">{editedText.length} 字</div>
            </section>
          )}

          <section className="control-section">
            <SectionHeading number="03" title="选择发布样式" subtitle="纯卡片，或抖音 3:4 背景图成品" />
            <div className="choice-grid">
              <button className={outputMode === "douyin" ? "selected" : ""} onClick={() => setOutputMode("douyin")}>
                <ImageIcon size={19} /><span><strong>抖音竖图</strong><small>下载后直接上传</small></span>
              </button>
              <button className={outputMode === "card" ? "selected" : ""} onClick={() => setOutputMode("card")}>
                <Bookmark size={19} /><span><strong>纯推文卡片</strong><small>保留 X 排版</small></span>
              </button>
            </div>
            <div className="card-option-row">
              <span>卡片颜色</span>
              <div className="theme-toggle" role="group" aria-label="卡片颜色">
                <button className={cardTheme === "light" ? "active" : ""} onClick={() => setCardTheme("light")}><Sun size={15} /> 白色</button>
                <button className={cardTheme === "dark" ? "active" : ""} onClick={() => setCardTheme("dark")}><Moon size={15} /> 黑色</button>
              </div>
              <button className="metric-button" onClick={() => setMetricVariant((value) => value + 1)}><Shuffle size={15} /> 换互动数据</button>
            </div>
          </section>

          {outputMode === "douyin" && (
            <section className="control-section background-section">
              <SectionHeading number="04" title="选择背景" subtitle="内置图库、本地上传、网络图片都能用" />
              <label className="search-box full">
                <Search size={17} />
                <input value={backgroundQuery} onChange={(event) => setBackgroundQuery(event.target.value)} placeholder="搜：城市、夜景、山海" />
              </label>
              <div className="background-grid">
                {visibleBackgrounds.map((background) => (
                  <button key={background.id} className={selectedBackground.id === background.id && !customBackground ? "selected" : ""} onClick={() => { setSelectedBackground(background); setCustomBackground(null); }}>
                    <img src={background.src} alt={background.name} />
                    <span>{background.name}</span>
                  </button>
                ))}
              </div>
              <label className="upload-button">
                <Upload size={17} /> 上传自己的背景
                <input type="file" accept="image/*" onChange={(event) => handleUpload(event.target.files?.[0])} />
              </label>
              <div className="url-row">
                <label><Link2 size={16} /><input value={remoteBackground} onChange={(event) => setRemoteBackground(event.target.value)} placeholder="或粘贴网上的图片地址" /></label>
                <button onClick={applyRemoteBackground}>使用</button>
              </div>
              <RangeControl label="背景压暗" value={`${dim}%`} min={0} max={55} current={dim} onChange={setDim} />
              <RangeControl label="卡片大小" value={`${cardScale}%`} min={70} max={108} current={cardScale} onChange={setCardScale} />
              <div className="drag-help"><Move size={16} /> 在右侧拖动卡片调整位置 <button onClick={() => setPosition({ x: 0, y: 0 })}><RefreshCw size={14} /> 居中重置</button></div>
            </section>
          )}

          <section className="control-section">
            <SectionHeading number="05" title="检查并下载" subtitle="右侧看到的就是最终图片" />
            <RangeControl label="正文字号" value={`${bodySize}px`} min={14} max={23} current={bodySize} onChange={setBodySize} />
            <RangeControl label="卡片透明度" value={`${cardOpacity}%`} min={55} max={100} current={cardOpacity} onChange={setCardOpacity} />
          </section>

          <section className="control-section caption-section">
            <SectionHeading number="06" title="准备发布文案和话题" subtitle="独立随机文案 + 3 个相关标签，不截取推文" />
            <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={5} placeholder="点击生成发布文案" />
            <div className="caption-actions">
              <button className="secondary-button" onClick={() => setCaption((current) => makeDifferentCaption({ ...selected, text: previewText }, current))}><Shuffle size={16} /> 随机换一版</button>
              <button className="secondary-button" onClick={copyCaption}><Copy size={16} /> {copyLabel}</button>
            </div>
          </section>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <strong><span className="live-dot" />{outputMode === "douyin" ? "抖音 3:4 成品预览" : "纯推文卡片预览"}</strong>
            <div>
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer"><Link2 size={14} /> 查看原推</a>
              <button onClick={chooseRandomPost}><Shuffle size={14} /> 换一组数据</button>
            </div>
          </div>

          <div className={`preview-stage ${outputMode}`}>
            <div
              ref={artboardRef}
              className={`artboard ${outputMode === "card" ? `card-only theme-${cardTheme}` : ""}`}
              style={undefined}
            >
              {outputMode === "douyin" && (
                <>
                  <img className="canvas-background" src={backgroundSrc} alt="" />
                  <div className="canvas-dim" style={{ background: `rgba(0,0,0,${dim / 100})` }} />
                </>
              )}
              <TweetCard
                ref={tweetCardRef}
                post={selected}
                text={previewText}
                fontSize={effectiveBodySize}
                theme={cardTheme}
                metricVariant={metricVariant}
                opacity={cardOpacity}
                className={outputMode === "douyin" ? "movable-card" : ""}
                style={outputMode === "douyin" ? {
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${cardScale / 100})`,
                } : undefined}
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={stopDrag}
                onPointerCancel={stopDrag}
              />
              {outputMode === "douyin" && <div className="canvas-signature">DONTBESILENT · 商业 / 成长 / AI</div>}
            </div>
          </div>

          <div className="preview-footer">
            <p><Check size={16} /> 下载图片，再复制发布文案，就能直接发抖音。</p>
            <div>
              <button className="secondary-button" onClick={copyCaption}><Copy size={16} /> 复制发布文案</button>
              <button className="download-button" onClick={downloadImage} disabled={isDownloading}>
                {isDownloading ? <LoaderCircle className="spin" size={17} /> : <Download size={17} />}
                {isDownloading ? "正在生成" : "一键下载成品"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="section-heading">
      <span>{number}</span>
      <div><h2>{title}</h2><p>{subtitle}</p></div>
    </div>
  );
}

function RangeControl({ label, value, min, max, current, onChange }: { label: string; value: string; min: number; max: number; current: number; onChange: (value: number) => void }) {
  return (
    <label className="range-control">
      <span>{label}<strong>{value}</strong></span>
      <input type="range" min={min} max={max} value={current} onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} ${value}`} />
    </label>
  );
}

const TweetCard = forwardRef(function TweetCard({
  post,
  text,
  fontSize,
  theme,
  metricVariant,
  opacity,
  className,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  post: Post;
  text: string;
  fontSize: number;
  theme: "light" | "dark";
  metricVariant: number;
  opacity: number;
  className?: string;
  style?: CSSProperties;
  onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove?: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: () => void;
  onPointerCancel?: () => void;
}, ref: ForwardedRef<HTMLElement>) {
  const metrics = syntheticMetrics(post, metricVariant);
  return (
    <article
      ref={ref}
      className={`tweet-card theme-${theme} ${className || ""}`}
      style={{
        ...style,
        "--tweet-size": `${fontSize}px`,
        "--card-alpha": opacity / 100,
      } as CSSProperties}
      aria-label="推文图片预览"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <header className="tweet-header">
        <div className="tweet-avatar">
          <img src="/avatar.png" alt="dontbesilent 头像" />
        </div>
        <div className="tweet-identity">
          <span><strong>dontbesilent</strong><VerifiedBadge /></span>
          <small>@dontbesilent · {displayDate(post.date)}</small>
        </div>
        <div className="tweet-actions"><XLogo size={18} /><MoreHorizontal size={19} /></div>
      </header>
      <div className="tweet-body">
        {text.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <div className="tweet-time">下午12:46 · {displayLongDate(post.date)} · <strong>{metrics.views}</strong>&nbsp;查看</div>
      <footer className="tweet-metrics">
        <span><MessageCircle />{metrics.comments}</span>
        <span><Repeat2 />{metrics.reposts}</span>
        <span><Heart />{metrics.likes}</span>
        <span><Bookmark />{metrics.bookmarks}</span>
        <span className="share-action" aria-label="分享"><Share2 /></span>
      </footer>
    </article>
  );
});
