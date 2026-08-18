import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("the searchable archive contains complete source records", () => {
  const posts = JSON.parse(fs.readFileSync(path.join(root, "public/posts.json"), "utf8"));

  assert.equal(posts.length, 1544);
  assert.ok(posts.every((post) => post.id && post.date && post.text && post.sourceUrl));
  assert.ok(posts.every((post) => /^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(post.sourceUrl)));
});

test("all built-in visual assets are present", () => {
  const assets = [
    "avatar.png",
    "og.png",
    "backgrounds/misty-valley.jpeg",
    "backgrounds/mountain-valley.jpeg",
    "backgrounds/harbor-blue.jpeg",
    "backgrounds/city-night.jpeg",
    "backgrounds/skyline.jpeg",
    "backgrounds/cloud-mountain.jpeg",
    "backgrounds/coast-road.jpeg",
    "backgrounds/forest-light.jpeg",
    ...Array.from(
      { length: 110 },
      (_, index) => `backgrounds/travel-${String(index + 1).padStart(3, "0")}.jpeg`,
    ),
  ];

  for (const asset of assets) {
    assert.ok(fs.statSync(path.join(root, "public", asset)).size > 10_000, `${asset} is missing or empty`);
  }
});
