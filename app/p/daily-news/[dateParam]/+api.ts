import { Article } from "@/utils/types";

export async function GET(request: Request) {
  console.log('Generating daily news page...');
  try {
    // Get date from URL path and convert from YYYYMMDD to YYYY-MM-DD
    const url = new URL(request.url);
    const yyyymmdd = url.pathname.split('/').pop() || '';
    const date = yyyymmdd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

    // Fetch articles for this date
    const response = await fetch(`${process.env.EXPO_PUBLIC_ESSENCE_REST_API_URL}/public/articles?date=${date}`);
    const data = await response.json();
    const articles = data.articles;

    console.log('Articles fetched:', articles?.length);

    if (!articles || articles.length === 0) {
      return new Response('No articles found for this date', { status: 404 });
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="robots" content="index, follow">
          <title>Daily News ${date} | Essence</title>
          <meta name="description" content="Retail Business news for ${date}">
        </head>
        <body>
          <h1>News for ${date}</h1>
          <div class="articles">
            ${articles.map((article: Article) => `
              <article>
                <h2><a href="/sharedNews/${article.public_key}">${article.title}</a></h2>
                <img src="${article.image}" alt="${article.title}" />
                <p>${article.summary_50}</p>
                <a href="/sharedNews/${article.public_key}">Read full article</a>
              </article>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating daily news page:', error);
    return new Response('Not Found', { status: 404 });
  }
} 