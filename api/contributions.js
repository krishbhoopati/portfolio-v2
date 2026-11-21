const USER = "krishbhoopati";

const textOf = (html) => html
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

const countFromLabel = (label) => {
  if (/^no contributions\b/i.test(label)) return 0;
  const match = label.match(/^([\d,]+)\s+contributions?\b/i);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ""));
};

const parseContributions = (html) => {
  const contributions = [];
  const pattern = /<td\b(?=[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})")(?=[^>]*\bdata-level="(\d)")[^>]*>\s*<\/td>\s*<tool-tip\b[^>]*>([\s\S]*?)<\/tool-tip>/g;
  for (const match of html.matchAll(pattern)) {
    const count = countFromLabel(textOf(match[3]));
    if (count === null) continue;
    contributions.push({
      date: match[1],
      count,
      level: Number(match[2]),
    });
  }

  contributions.sort((a, b) => a.date.localeCompare(b.date));
  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);
  const summed = contributions.reduce((sum, day) => sum + day.count, 0);
  const lastYear = totalMatch ? Number(totalMatch[1].replace(/,/g, "")) : summed;
  return { total: { lastYear }, contributions };
};

export async function loadContributions() {
  const response = await fetch(`https://github.com/users/${USER}/contributions`, {
    headers: {
      Accept: "text/html, */*",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
      Referer: `https://github.com/${USER}`,
    },
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const data = parseContributions(await response.text());
  if (data.contributions.length < 350 || data.total.lastYear !== data.contributions.reduce((sum, day) => sum + day.count, 0)) {
    throw new Error("Could not read the contribution calendar");
  }
  return data;
}

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    send(res, 405, { error: "method" });
    return;
  }

  try {
    const data = await loadContributions();
    if (req.method === "HEAD") {
      res.statusCode = 200;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end();
      return;
    }
    send(res, 200, data);
  } catch {
    send(res, 502, { error: "contributions" });
  }
}
