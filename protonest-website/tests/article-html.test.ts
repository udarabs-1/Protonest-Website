// Run with: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    addIdsToHeadings,
    enhanceArticleHtml,
    extractTocItems,
    htmlToText,
    prepareArticle,
    removeTitleHeading,
} from '../src/lib/article-html.ts';

test('htmlToText strips tags and decodes entities', () => {
    assert.equal(htmlToText('<p>Load &amp; <b>Speed</b> &#39;x&#x27;</p>'), "Load & Speed 'x'");
});

test('removeTitleHeading removes an H1 that repeats the title only', () => {
    assert.equal(removeTitleHeading('<h1>My  Title</h1><p>a</p>', 'my title'), '<p>a</p>');
    assert.equal(removeTitleHeading('<h1>Other</h1><p>a</p>', 'My Title'), '<h1>Other</h1><p>a</p>');
});

test('addIdsToHeadings gives unique ids and replaces existing ones', () => {
    const html = addIdsToHeadings('<h2 id="old">Load &amp; Speed</h2><h2>Load &amp; Speed</h2><h3 class="x">Sub</h3>');
    assert.equal(html, '<h2 id="load-speed">Load &amp; Speed</h2><h2 id="load-speed-2">Load &amp; Speed</h2><h3 id="sub" class="x">Sub</h3>');
});

test('extractTocItems lists only the top heading level', () => {
    const toc = extractTocItems('<h2 id="a">A</h2><h3 id="b">B</h3><h2 id="c">C &amp; D</h2>');
    assert.deepEqual(toc, [
        { id: 'a', text: 'A', level: 2 },
        { id: 'c', text: 'C & D', level: 2 },
    ]);
    assert.deepEqual(extractTocItems('<p>no headings</p>'), []);
});

test('enhanceArticleHtml points CMS media at the CMS', () => {
    assert.equal(
        enhanceArticleHtml('<img src="/api/media/file/a.png" alt=""><img src="https://x.com/b.png">', 'https://cms.test'),
        '<img src="https://cms.test/api/media/file/a.png" alt=""><img src="https://x.com/b.png">',
    );
});

test('enhanceArticleHtml embeds a YouTube link on its own line', () => {
    const html = enhanceArticleHtml('<p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&amp;t=3">Demo</a></p>');
    assert.match(html, /^<figure class="video-embed"><iframe src="https:\/\/www.youtube-nocookie.com\/embed\/dQw4w9WgXcQ"/);
    assert.match(html, /<figcaption>Demo<\/figcaption><\/figure>$/);
    // A YouTube link inside a sentence stays a link
    const inline = '<p>Watch <a href="https://youtu.be/dQw4w9WgXcQ">this</a> now</p>';
    assert.equal(enhanceArticleHtml(inline), inline);
});

test('enhanceArticleHtml styles "Figure N" lines as captions', () => {
    assert.equal(enhanceArticleHtml('<p><em>Figure 1: Diagram</em></p>'), '<p class="figure-caption"><em>Figure 1: Diagram</em></p>');
    assert.equal(enhanceArticleHtml('<p>Text <em>Figure 2</em></p>'), '<p>Text <em>Figure 2</em></p>');
});

test('prepareArticle does everything in order', () => {
    const { content, toc } = prepareArticle('<h1>T</h1><h2>Intro</h2><p>x</p>', 'T');
    assert.equal(content, '<h2 id="intro">Intro</h2><p>x</p>');
    assert.deepEqual(toc, [{ id: 'intro', text: 'Intro', level: 2 }]);
});
