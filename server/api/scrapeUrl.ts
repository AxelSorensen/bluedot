
import * as cheerio from 'cheerio';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const url = body.url;
    const html = await $fetch(url);
    const $ = cheerio.load(html);
    $('script, style, iframe, noscript, meta, link, br').remove(); // Load HTML into cheerio for parsing
    const response = $('body').text()
    return response;
});