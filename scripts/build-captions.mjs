import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outputPath = path.resolve(root, "public", "captions.json");

const blockers = [
  "能力不够",
  "现实太难",
  "机会太少",
  "方法不对",
  "资源太少",
  "运气不好",
  "起点太低",
  "别人太强",
  "环境太差",
  "时间太晚",
  "问题太大",
  "信息太少",
  "选择太多",
  "反馈太慢",
  "目标太远",
  "成本太高",
  "表达太笨",
  "开始太难",
  "变化太快",
  "世界太吵",
];

const hiddenReasons = [
  "还想保留一个不必失败的自己",
  "还没有真正承认自己已经做了选择",
  "太久没有见过真实反馈",
  "一直在用想象替代行动",
  "不愿意把问题放到具体场景里",
  "还舍不得放下那套旧解释",
  "习惯了把逃避包装成谨慎",
  "总想等到一个不用负责的时刻",
  "不敢让结果来打断自我安慰",
  "还在用热闹证明自己没有停下",
  "把别人的判断放得太靠前",
  "宁愿继续提问，也不愿开始执行",
  "怕一动手就失去完美的幻想",
  "把准备当成了更体面的拖延",
  "一直没有把代价算进答案里",
  "还没有遇到必须改变的那堵墙",
  "把模糊当成了最后的安全感",
  "太想被理解，反而忘了先做成事",
  "还在等待一种不会受伤的清醒",
  "没有真正把自己放回现实里",
];

const actions = [
  "开始做一件具体的小事",
  "先把问题写到可以执行",
  "愿意承受第一轮反馈",
  "把答案放回真实场景",
  "停止向世界解释自己",
  "先接受结果可能不好",
  "把注意力收回手边",
  "承认自己正在逃避",
  "先完成一次笨拙的尝试",
  "把热闹和结果分开",
  "让行动替自己说话",
  "把问题拆到今天能做",
  "不再为拖延寻找名字",
  "先看见自己真正害怕什么",
  "允许自己从普通动作开始",
  "把选择变成每天的动作",
  "不再把清醒停在嘴上",
  "把幻想交给结果检验",
  "先靠近一个真实的人",
  "把判断留给下一次复盘",
];

const outcomes = [
  "焦虑才会慢慢变成具体问题",
  "很多困难才会露出真实形状",
  "人会从混乱里重新拿回节奏",
  "世界才会给出更准确的回应",
  "那些想象出来的阻力才会变小",
  "判断才不会一直停在口号里",
  "你才知道自己到底卡在哪里",
  "事情才算真正开始发生",
  "内耗才不会继续替你消耗人生",
  "答案才有机会从生活里长出来",
  "失败才会回到它该在的位置",
  "努力才不会只是另一种表演",
  "你才不会被每个声音带着走",
  "表达才会重新变得有重量",
  "机会才不会从眼前安静走掉",
  "生活才不会只剩下解释",
  "关系才会开始出现真实反馈",
  "很多答案才会变得没有那么神秘",
  "你才会知道什么值得继续",
  "自由才不会变成另一种空转",
];

const frames = [
  "真正成熟的人，",
  "一个人开始变稳，",
  "很多事情变简单，",
  "真正的改变发生时，",
  "人从幻想里退出来，",
  "一个人不再原地打转，",
  "事情真正开始向前，",
  "判断开始变得可靠，",
  "表达重新变得有分量，",
  "一个人慢慢长出力量，",
];

const matureActs = [
  "不是忽然没有情绪，而是知道先把事情放回原位",
  "不是突然拥有答案，而是不再用新问题逃避旧答案",
  "不是变得更会说，而是愿意让结果来校准自己",
  "不是不怕失败，而是不再让失败替整个人生定性",
  "不是抓住所有机会，而是终于知道哪些热闹不必参与",
  "不是一夜之间想通，而是开始尊重每个具体代价",
  "不是把自己变硬，而是能在反馈里继续调整方向",
  "不是从此不再犹豫，而是犹豫之后仍然能动手",
  "不是站到更高的地方，而是更少欺骗眼前的现实",
  "不是急着证明正确，而是允许结果慢慢改变判断",
];

const stillLines = [
  "有些人不是不想努力，只是每一步都像在接受审判。",
  "真正的松弛，是不再用恐惧提前支付每一次结果。",
  "人会在反复拖延里，慢慢把一件小事养成命运。",
  "很多答案不是被想出来的，是被一次次反馈逼清楚的。",
  "一个人越想保留完美形象，越容易迟迟不肯开始。",
  "有些清醒不是想通了，而是终于愿意面对代价了。",
  "真正让人变轻的，不是问题消失，而是终于开始行动。",
  "能把问题变具体的人，已经比大多数人更接近答案。",
  "很多人不是不知道方向，只是不想承认那条路很普通。",
  "真正稳定的判断，往往来自一连串不体面的试错。",
  "你越害怕被现实纠正，越容易把幻想误认成远见。",
  "有些坚持不是意志力强，只是还没找到更诚实的选择。",
  "真正的独立不是谁也不需要，而是知道该向谁求证。",
  "人最难放下的，常常不是机会，而是已经投入过的自己。",
  "很多热闹只是把空心盖住，并没有让事情真正前进一步。",
  "表达真正有力量的时候，通常不是更响，而是更准确。",
  "越想绕开具体问题，越容易为抽象答案付出代价。",
  "真正的准备会缩短开始的距离，假的准备只会延长犹豫。",
  "一个人不再慌的时候，往往是终于允许结果不完美。",
  "很多失败并不可怕，可怕的是它被拿来解释整个人生。",
  "真正值钱的认知，最后都会变成更具体的行动顺序。",
  "人只有停止替自己辩护，才有机会听见现实在说什么。",
  "有些问题不是你不会解决，而是你一直不肯靠近现场。",
  "很多所谓没机会，只是还没有把眼前的路走到尽头。",
  "真正开始做事以后，体面会退后，反馈会站到前面。",
  "一个人越急着证明自己，越容易错过事情本身的要求。",
  "很多人以为在等时机，其实是在等一种不会受伤的开始。",
  "判断不是站得更高，而是更少被自己的解释带着走。",
  "真正的复盘不是安慰自己，而是让下一次动作发生变化。",
  "有些路越早承认普通，越早有机会走出自己的结果。",
  "一个人愿意先做笨事，才可能慢慢得到聪明的反馈。",
  "很多内耗不是想得太深，而是一直没有把事情做小。",
  "真正的成长不是变得正确，而是更快发现自己错在哪里。",
  "人最容易困住自己的地方，是把解释当成了改变。",
  "很多自由不是来自选择更多，而是终于知道什么不用选。",
  "你越想一次想明白，越容易错过那些只能做出来的答案。",
  "真正让关系变清楚的，不是表态，而是一次具体的兑现。",
  "很多事情不是没有入口，只是入口看起来太不像答案。",
  "一个人开始对结果负责，很多情绪就会自动降噪。",
  "真正的长期不是忍受混乱，而是持续把事情放回正轨。",
];

const captionGroups = new Map();

for (const blocker of blockers) {
  for (const reason of hiddenReasons) {
    addCaption("hidden-1", `很多人以为自己卡在${blocker}，其实是${reason}。`);
    addCaption("hidden-2", `真正让人停下来的，往往不是${blocker}，而是${reason}。`);
    addCaption("hidden-3", `你以为问题出在${blocker}，后来才发现，是${reason}。`);
  }
}

for (const action of actions) {
  for (const outcome of outcomes) {
    addCaption("action-1", `当一个人愿意${action}，${outcome}。`);
    addCaption("action-2", `先${action}，${outcome}。`);
    addCaption("action-3", `真正开始改变，常常是从${action}那一刻开始的。`);
  }
}

for (const frame of frames) {
  for (const act of matureActs) {
    addCaption("mature", `${frame}${act}。`);
  }
}

for (const line of stillLines) {
  addCaption("still", line);
}

const output = selectBalancedCaptions(captionGroups, 420);

if (output.length < 300) {
  throw new Error(`caption pool is too small: ${output.length}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output.slice(0, 420), null, 2)}\n`, "utf8");
console.log(`Generated ${Math.min(output.length, 420)} captions at ${outputPath}`);

function addCaption(group, value) {
  const caption = normalize(value);
  if (isValidCaption(caption) && !hasBannedPattern(caption)) {
    if (!captionGroups.has(group)) captionGroups.set(group, new Set());
    captionGroups.get(group).add(caption);
  }
}

function normalize(value) {
  return String(value).replace(/\s+/g, " ").replace(/\u3000/g, " ").trim();
}

function isValidCaption(value) {
  const length = Array.from(value).length;
  return length >= 30 && length <= 40;
}

function hasBannedPattern(value) {
  return ["Midjourney", "Build in Public", "AI", "dbskill", "奥地利经济学派", "#"].some((pattern) => value.includes(pattern));
}

function selectBalancedCaptions(groups, limit) {
  const sortedGroups = [...groups.entries()].map(([group, values]) => [
    group,
    [...values].sort((left, right) => scoreCaption(left) - scoreCaption(right) || left.localeCompare(right, "zh-Hans-CN")),
  ]);
  const selected = [];
  const seen = new Set();
  let index = 0;

  while (selected.length < limit) {
    let addedThisRound = false;
    for (const [, values] of sortedGroups) {
      const caption = values[index];
      if (caption && !seen.has(caption)) {
        selected.push(caption);
        seen.add(caption);
        addedThisRound = true;
        if (selected.length === limit) return selected;
      }
    }
    if (!addedThisRound) break;
    index += 1;
  }

  return selected;
}

function scoreCaption(value) {
  const length = Array.from(value).length;
  const lengthScore = Math.abs(35 - length) * 1_000_000;
  return lengthScore + hashString(value);
}

function hashString(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
