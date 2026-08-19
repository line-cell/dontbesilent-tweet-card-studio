import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(root, "public", "posts.json");
const outputPath = path.resolve(root, "public", "captions.json");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const posts = Array.isArray(source) ? source : Array.isArray(source.posts) ? source.posts : [];

if (posts.length === 0) {
  throw new Error(`No posts found in ${sourcePath}`);
}

const subjectWords = unique([
  ...posts.flatMap((post) => [post.topic, post.format, ...(Array.isArray(post.tags) ? post.tags : [])]),
  "行动", "判断", "表达", "认知", "执行力", "商业", "内容", "流量", "产品", "需求",
  "生意", "选择", "边界", "长期", "反馈", "结果", "状态", "节奏", "合作", "价值",
]);

const contrastWords = unique([
  "焦虑", "内耗", "口号", "情绪", "幻想", "借口", "表演", "噪音", "误解", "标签",
  "空话", "拖延", "自我感动", "短期刺激", "盲动", "比较", "犹豫", "虚火", "低效", "冲动",
]);

const actionWords = unique([
  "先验证", "先执行", "先看结果", "慢下来", "做扎实", "说清楚", "稳住", "复盘", "取舍", "落地",
]);

const templates = [
  ({ subject, contrast }) => `真正的${subject}，不是${contrast}，而是能被结果反复验证。`,
  ({ subject, contrast }) => `别把${subject}讲成${contrast}，先看它能不能解决真实问题。`,
  ({ subject, action }) => `越是想做好${subject}，越要${action}，不要急着证明自己。`,
  ({ subject, contrast }) => `${subject}不是一句漂亮话，它要能穿过${contrast}留下结果。`,
  ({ subject, contrast, action }) => `当${contrast}出现时，还能围绕${subject}${action}，才算真的想明白了。`,
  ({ subject, contrast }) => `很多人不是缺${subject}，而是被${contrast}带走了注意力。`,
  ({ subject, contrast }) => `先把${subject}放进具体场景，很多${contrast}自然就散了。`,
  ({ subject, action }) => `${subject}这件事，不靠表态，靠一次次${action}。`,
  ({ subject, contrast }) => `真正有用的${subject}，会减少${contrast}，而不是制造更多解释。`,
  ({ subject, contrast, action }) => `别急着包装${subject}，先在${contrast}里把事情${action}。`,
];

const captions = [];
for (const subject of subjectWords) {
  for (const contrast of contrastWords) {
    for (const action of actionWords) {
      for (const template of templates) {
        const caption = normalize(template({ subject, contrast, action }));
        if (isValidCaption(caption)) captions.push(caption);
      }
    }
  }
}

for (const post of posts) {
  const text = typeof post.text === "string" ? post.text : "";
  const firstLine = text.split(/\n+/).map((line) => line.trim()).find(Boolean);
  if (!firstLine) continue;
  const core = normalize(firstLine
    .replace(/[《》【】[\]（）()“”"'`]/g, "")
    .replace(/[，。！？!?；;：:、].*$/, "")
    .replace(/\s+/g, " "))
    .slice(0, 16)
    .trim();
  if (core.length < 2) continue;
  captions.push(
    normalize(`把${core}放回真实场景里，判断会比口号更清楚。`),
    normalize(`别急着评价${core}，先看它解决了谁的具体问题。`),
    normalize(`${core}不是观点装饰，而是要落到行动和结果里。`),
  );
}

const output = unique(captions)
  .filter(isValidCaption)
  .sort((left, right) => hashString(left) - hashString(right) || left.localeCompare(right, "zh-Hans-CN"));

if (output.length < 300) {
  throw new Error(`caption pool is too small: ${output.length}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output.slice(0, 420), null, 2)}\n`, "utf8");
console.log(`Generated ${Math.min(output.length, 420)} captions at ${outputPath}`);

function normalize(value) {
  return String(value).replace(/\s+/g, " ").replace(/\u3000/g, " ").trim();
}

function isValidCaption(value) {
  const length = Array.from(value).length;
  return length >= 30 && length <= 40;
}

function unique(values) {
  return [...new Set(values.map(normalize).filter(Boolean))];
}

function hashString(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
