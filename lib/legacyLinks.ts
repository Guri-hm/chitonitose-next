import fs from 'fs';
import path from 'path';

let cache: Map<string, string> | null = null;

/** data/legacy-urls.json から「旧ファイル名（拡張子なし）→新URL」の対応表を作る */
function loadMap(): Map<string, string> {
  if (cache) return cache;
  const list: { from: string; to: string }[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'legacy-urls.json'), 'utf-8')
  );
  cache = new Map();
  for (const { from, to } of list) {
    const base = from.split('/').pop()!.replace(/\.html$/, '');
    cache.set(base, to);
  }
  return cache;
}

/**
 * 本文中の旧サイトの相対リンク（href="geo_lessons_xxx.html#id" など）を新URLに書き換える。
 * 新サイトでは /geo/xxx/ のようなURLになり、相対のままでは404になるため。
 */
export function rewriteLegacyLinks(html: string): string {
  const map = loadMap();
  return html.replace(/href="((?:geo|jh|wh)_[\w-]+)(?:\.html)?(#[^"]*)?"/g, (whole, base: string, hash?: string) => {
    const to = map.get(base);
    return to ? `href="${to}${hash ?? ''}"` : whole;
  });
}
