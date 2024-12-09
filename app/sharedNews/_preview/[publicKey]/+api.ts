const API_BASE_URL = process.env.EXPO_PUBLIC_ESSENCE_REST_API_URL;

export const getArticleFromServer = async (publicKey: string) => {
    try {
        const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
        };

        const config: RequestInit = {
            method: "GET",
            headers,
            body: undefined,
        };

        const response = await fetch(
            `${API_BASE_URL}/public/article/${publicKey}`,
            config,
        );

        if (!response.ok) {
            throw new Error("Failed to get article from server");
        }
        const article = await response.json();
        return article;
    } catch (error) {
        console.error("Failed to get article from server:", error);
        throw new Error("Failed to get article from server");
    }
};


export async function GET(request: Request) {
    try {
        // Get publicKey from URL path
        const url = new URL(request.url);
        const pathParts = url.pathname.split('/');
        const publicKey = pathParts[pathParts.length - 1];
        console.log("Going to get article for publicKey >>> ", publicKey);

        // Fetch article data
        const article = await getArticleFromServer(publicKey);
        console.log("article >>> ", article.title);
        // Generate SSR HTML with proper meta tags
        const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${article.title}</title>

          <!-- OpenGraph Meta Tags -->
          <meta property="og:title" content="${article.title}" />
          <meta property="og:description" content="${article.summary_50}" />
          <meta property="og:image" content="${article.image}" />
          <meta property="og:url" content="${process.env.EXPO_PUBLIC_SITE_URL}/sharedNews/${publicKey}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Essence News" />

          <!-- Twitter Card Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${article.title}" />
          <meta name="twitter:description" content="${article.summary_50}" />
          <meta name="twitter:image" content="${article.image}" />

          <!-- Other Meta Tags -->
          <meta name="description" content="${article.summary_50}">
        </head>
        <body>
          <script>
            // Redirect to the app view for human visitors
            window.location.href = '/sharedNews/${publicKey}';
          </script>
        </body>
      </html>
    `;

        return new Response(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html",
            },
        });
    } catch (error) {
        console.error("Error generating share preview:", error);
        return new Response("Article not found", { status: 404 });
    }
}


// export async function GET(request: Request) {
//     // Return a distinctive response
//     return new Response("API ROUTE WAS HIT", {
//         status: 200,
//         headers: {
//             "Content-Type": "text/plain",
//         },
//     });
// }