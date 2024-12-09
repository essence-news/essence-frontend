import { Article } from "@/utils/types";

export async function GET() {
  console.log('Generating sitemap...');
  try {
    // Generate dates for the last 15 days
    const dates = Array.from({ length: 15 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // Format: YYYYMMDD
      return date.toISOString().split('T')[0].replace(/-/g, '');
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Daily digest pages for last 15 days -->
      ${dates.map(date => `
        <url>
          <loc>${process.env.EXPO_PUBLIC_SITE_URL}/p/daily-news/${date}</loc>
          <lastmod>${date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}T23:59:59Z</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `).join('')}
    </urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}