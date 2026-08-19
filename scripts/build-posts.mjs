import fs from "node:fs";
import path from "node:path";

const webRoot = path.resolve(import.meta.dirname, "..");
const sourceArg = process.argv[2];
if (!sourceArg) {
  throw new Error("Usage: npm run data:build -- path/to/source-tweets.md");
}
const sourcePath = path.resolve(process.cwd(), sourceArg);
const samplePath = path.resolve(webRoot, "../data/posts.json");
const outputPath = path.resolve(webRoot, "public/posts.json");

const markdown = fs.readFileSync(sourcePath, "utf8");
const sampleData = JSON.parse(fs.readFileSync(samplePath, "utf8"));
const sampleByUrl = new Map(
  sampleData.posts.map((post) => [post.source_url, post]),
);

const sections = markdown.split(/^---$/m);
const posts = [];

for (const section of sections) {
  const header = section.match(/^\s*##\s+(\d{4}-\d{2}-\d{2})\s+·\s+(.+)$/m);
  if (!header) continue;

  const source = section.match(
    /原帖：\[?(https:\/\/x\.com\/[^\]\s)]+\/status\/(\d+))[^\n]*/,
  );
  if (!source) continue;

  const quoteLines = [];
  for (const line of section.slice(header.index + header[0].length).split("\n")) {
    if (line.startsWith(">")) {
      quoteLines.push(line.replace(/^> ?/, ""));
    } else if (quoteLines.length > 0) {
      break;
    }
  }

  const text = quoteLines.join("\n").trim();
  if (!text) continue;

  const topic = section.match(/^主题：([^｜\n]+)｜表达：([^\n]+)$/m);
  const tags = section.match(/^标签：([^\n]+)$/m);
  const sample = sampleByUrl.get(source[1]);

  posts.push({
    id: source[2],
    date: header[1],
    kind: header[2].trim(),
    text,
    sourceUrl: source[1],
    topic: topic?.[1]?.trim() || "认知与成长",
    format: topic?.[2]?.trim() || "观点",
    tags: tags?.[1]?.split(/[、，,]/).map((tag) => tag.trim()).filter(Boolean) || [],
    metrics: sample?.metrics || null,
  });
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(posts)}\n`);
console.log(`Generated ${posts.length} posts at ${outputPath}`);
