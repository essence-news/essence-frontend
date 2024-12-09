export async function GET(request: Request) {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`;

    return new Response(robotsTxt, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'X-Robots-Tag': 'index, follow'
        },
    });
}
