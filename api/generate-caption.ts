import { POST } from "../app/api/generate-caption/route";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
  json: (body: unknown) => void;
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.status(405).setHeader("Allow", "POST").json({ error: "只支持 POST 请求。" });
    return;
  }

  const body = typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {});
  const upstreamRequest = new Request("https://local.invalid/api/generate-caption", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const result = await POST(upstreamRequest);
  response.status(result.status);
  result.headers.forEach((value, key) => response.setHeader(key, value));
  response.json(await result.json());
}
