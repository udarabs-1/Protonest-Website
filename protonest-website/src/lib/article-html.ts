// Prepares CMS article HTML for the blog article page. Runs on the server (no DOM there), so it
// works on the HTML string. The CMS (Payload Lexical) writes simple, predictable HTML, which
// these patterns are written for.

import { CMS_URL } from './cms-blogs';

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

// Visible text of an HTML fragment
export const htmlToText = (html: string): string =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
            if (code[0] === '#') {
                const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
                return Number.isFinite(n) ? String.fromCodePoint(n) : match;
            }
            return ENTITIES[code.toLowerCase()] ?? match;
        })
        .replace(/\s+/g, ' ')
        .trim();

const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escapeText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const HEADING = /<(h[1-3])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;

// CMS articles often start with an H1 that repeats the post title; the page already shows it
export const removeTitleHeading = (html: string, title: string): string => {
    const match = /<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/i.exec(html);
    const normalise = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
    if (match && normalise(htmlToText(match[2])) === normalise(title)) {
        return html.slice(0, match.index) + html.slice(match.index + match[0].length);
    }
    return html;
};

// Gives every h1-h3 an id for the table of contents; repeated headings get -2, -3, ...
export const addIdsToHeadings = (html: string): string => {
    const used = new Set<string>();
    return html.replace(HEADING, (_all, tag: string, attrs: string | undefined, inner: string) => {
        const base = htmlToText(inner).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let id = base;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
        used.add(id);
        const rest = (attrs ?? '').replace(/\sid\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, '');
        return `<${tag} id="${escapeAttr(id)}"${rest}>${inner}</${tag}>`;
    });
};

// The main sections for the table of contents (the highest heading level used, not sub-headings)
export const extractTocItems = (html: string): TocItem[] => {
    const items: TocItem[] = [];
    for (const match of html.matchAll(HEADING)) {
        const text = htmlToText(match[3]);
        const id = /\sid\s*=\s*"([^"]*)"/i.exec(match[2] ?? '')?.[1];
        if (text && id) items.push({ id, text, level: Number(match[1][1]) });
    }
    if (!items.length) return items;
    const topLevel = Math.min(...items.map((item) => item.level));
    return items.filter((item) => item.level === topLevel);
};

const youTubeId = (href: string): string | null => {
    try {
        const url = new URL(href.replace(/&amp;/g, '&'));
        if (url.hostname === 'youtu.be') return url.pathname.slice(1) || null;
        if (url.hostname.endsWith('youtube.com')) return url.searchParams.get('v');
    } catch {
        return null;
    }
    return null;
};

// CMS media URLs point at the CMS, a YouTube link on its own line becomes an embedded video,
// and "Figure N: ..." lines are styled as captions
export const enhanceArticleHtml = (html: string): string =>
    html
        .replace(/(<img\b[^>]*?\ssrc=")(\/[^"]*")/gi, `$1${CMS_URL}$2`)
        .replace(/(<source\b[^>]*?\ssrcset=")(\/[^"]*")/gi, `$1${CMS_URL}$2`)
        .replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (all, attrs: string | undefined, inner: string) => {
            const content = inner.trim();

            const link = /^<a\b[^>]*\shref="([^"]*)"[^>]*>([\s\S]*?)<\/a>$/i.exec(content);
            const videoId = link ? youTubeId(link[1]) : null;
            if (link && videoId && /^[\w-]{6,}$/.test(videoId)) {
                const label = htmlToText(link[2]);
                return (
                    `<figure class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" ` +
                    `title="${escapeAttr(label || 'YouTube video')}" loading="lazy" ` +
                    `allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` +
                    (label ? `<figcaption>${escapeText(label)}</figcaption>` : '') +
                    `</figure>`
                );
            }

            const em = /^<em\b[^>]*>([\s\S]*?)<\/em>$/i.exec(content);
            if (em && !/<\/em>/i.test(em[1]) && /^(Figure|Fig\.|Table)\s*\d+/i.test(htmlToText(em[1]))) {
                const rest = attrs ?? '';
                if (/\sclass="/i.test(rest)) return all.replace(/\sclass="/i, ' class="figure-caption ');
                return `<p class="figure-caption"${rest}>${inner}</p>`;
            }
            return all;
        });

// Everything the article page needs from the CMS HTML
export const prepareArticle = (html: string, title: string): { content: string; toc: TocItem[] } => {
    const content = addIdsToHeadings(enhanceArticleHtml(removeTitleHeading(html, title)));
    return { content, toc: extractTocItems(content) };
};
