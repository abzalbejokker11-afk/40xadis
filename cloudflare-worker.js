/**
 * Qirq Hadis — Telegram proxy (Cloudflare Worker)
 * Token bu yerda YO'Q — u Cloudflare'da maxfiy o'zgaruvchi (Secret) sifatida saqlanadi.
 *
 * O'RNATISH:
 * 1. dash.cloudflare.com → Workers & Pages → Create Worker → nom: qirq-hadis-tg
 * 2. Shu kodni to'liq joylashtiring → Deploy
 * 3. Worker → Settings → Variables and Secrets → Add:
 *      Type: Secret, Name: TG_TOKEN, Value: (BotFather bergan YANGI token)
 * 4. Worker URL'ini (https://qirq-hadis-tg.XXXX.workers.dev) menga yozing —
 *    index.html dagi TG_PROXY ga qo'yib GitHub'ga yuklayman.
 */
const CHAT = '@arbainsavoljavob';
const ALLOW = 'https://abzalbejokker11-afk.github.io';

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': ALLOW,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST')
      return new Response('Only POST', { status: 405, headers: cors });

    const path = new URL(request.url).pathname;
    let resp;
    if (path === '/sendDocument') {
      // sertifikat rasmi (FormData: caption, document)
      const fd = await request.formData();
      fd.set('chat_id', CHAT);
      resp = await fetch('https://api.telegram.org/bot' + env.TG_TOKEN + '/sendDocument', {
        method: 'POST', body: fd
      });
    } else {
      // oddiy xabar (JSON: {text})
      const data = await request.json().catch(() => ({}));
      if (!data.text) return new Response('{"ok":false,"description":"text yo\'q"}', { status: 400, headers: cors });
      resp = await fetch('https://api.telegram.org/bot' + env.TG_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT, text: String(data.text).slice(0, 4000) })
      });
    }
    const body = await resp.text();
    return new Response(body, { status: resp.status, headers: { ...cors, 'content-type': 'application/json' } });
  }
};
