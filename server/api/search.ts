export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const apiKey = '3mM44WkB26FNEt_4z7j7xB8mEyGvdwvhCBHUH';
    const apiSecret = 'EQPg6GXPPYz5E1SKoWcmC1';
    const your_rapidapi_key = '7efa1ca5camshf15ac7b1d04e8e1p19440bjsneea5a4fdc694'
    const domain = body.domain
    const url = `https://domainr.p.rapidapi.com/v2/status?mashape-key=${your_rapidapi_key}&domain=${domain}`;

    const response = await fetch(url, {
        method: 'GET',
    });

    const data = await response.json();
    return data
});