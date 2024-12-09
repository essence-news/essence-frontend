// import { mockResponse } from "@/constants/mock";
import { mockSharedArticle } from "@/constants/mock";
import { promises as fs } from "fs";

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Essence - Your own news player</title>
  <!-- general meta data -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">    
  <meta name=robots content="index,follow">    
  <meta name="description" content="SHORT_DESCRIPTION">
  <meta name="keywords" content="">
  <meta name="author" content="NAME">
  <link rel="canonical" href="URL">
  <meta name="subject" content="WEBSITE PAGE SUBJECT">
  <meta name="copyright" content="COPYRIGHT_HOLDERS">
  <meta name="revised" content="REVISION_DATE">
  <meta name='Classification' content='Business'>
  <meta name='url' content='URL'>
  <meta http-equiv='Expires' content='0'>
  <meta http-equiv='Pragma' content='no-cache'>
  <meta http-equiv='Cache-Control' content='no-cache'>
  <meta http-equiv='imagetoolbar' content='no'>
  <meta http-equiv='x-dns-prefetch-control' content='off'>    
  <!-- Twitter Card data https://dev.twitter.com/cards/overview -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@TWITTER_ID">
  <meta name="twitter:title" content="ARTICLE_TITLE">
  <meta name="twitter:description" content="ARTICLE_DESCRIPTION">  
  <meta name="twitter:creator" content="@CREATOR">
  <meta name="twitter:image" content="ARTICLE_IMAGE">
  <!-- Open Graph data http://ogp.me/ -->
  <meta property="og:title" content="ARTICLE_TITLE" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="ARTICLE_URL" />
  <meta property="og:image" content="ARTICLE_IMAGE" />
  <meta property="og:description" content="ARTICLE_DESCRIPTION">
  <meta property="og:site_name" content="Essence" />
  <meta property="og:locale" content="en_US">
<style>
body {
  background-color: #fcfaf7;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  @font-face{
    font-family:anticon;
    src:url(/assets/?unstable_path=.%2Fnode_modules%2F%40expo%2Fvector-icons%2Fbuild%2Fvendor%2Freact-native-vector-icons%2FFonts/AntDesign.ttf);
    font-display:auto;
  }
  @font-face{
    font-family:ionicons;
    src:url(/assets/?unstable_path=.%2Fnode_modules%2F%40expo%2Fvector-icons%2Fbuild%2Fvendor%2Freact-native-vector-icons%2FFonts/Ionicons.ttf);
    font-display:auto;
  }
}
  .header {
    display: flex;
    width: 100vw;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(45, 42, 39, 0.8);
    box-sizing: border-box;
    padding: 10px 20px;
    min-height: 50px;
  }
  .essence {
    cursor: pointer;
    font-size: 24px;
    margin-left: 10px;
    color: rgba(255,255,255,1.00);
  }
  .joinButton {
    margin-right: 20px;
    border-bottom-style: solid;
    border-left-style: solid;
    border-right-style: solid;
    border-top-style: solid;
    border-color: rgb(0, 0, 0);
    border-width: 0px;
    font-size: 18px;
    cursor: pointer;
    margin-top: 5px;
    color: rgba(255,255,255,1.00);
    padding-bottom: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    background-color: rgb(71, 144, 255);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-family: Inter_400Regular;
  }
  .player {
    color: rgba(255,255,255,1.00);
    margin: 0 auto;
    min-height: calc(100vh - 120px);
    background-color: antiquewhite;
    max-width: 500px;
    padding: 30px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .title {
    margin-top: 50px;
  }
  .tags {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
  .progressAndButtons {
    margin-top: 100px;
  }
  .buttons {
    display: flex;
    gap: 20px;
  }
  .summary {
    display: flex;
    flex-basis: auto;
    flex-direction: column;

    background-color: rgba(45, 42, 39, 0.8);
    padding-left: 20px;
    padding-right: 20px;
    font-family: Inter_400Regular;
    padding-bottom: 20px;
    padding-top: 20px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .titleBar {
    display: flex;
    justify-content: space-between;
  }
</style>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Essence - Your own news player</title>
  <script>

    async function loadArticle() {
      const audio = new Audio("SOUND_URL");

      audio.play();
    }
    loadArticle();
  </script>
</head>
<body>
  <div class="header">
    <div>
      <img src="/assets/assets/logo.6528c8ba766c57aa1d311b6d4f3ba6b1.png"  />
      <span class="essence">essence</span>
    </div>
      <button class="joinButton">Join</button>
    </div>
  </div>
  <div class="body">
    <div class="player">
      <div>
        <div class="title">TITLE</div>
        <div class="tags">
          <div>Tag1</div>
          <div>Tag2</div>
        </div>
      </div>
      <div class="progressAndButtons">
        <div>Progress bar</div>
        <div class="buttons">
          <div>speed</div>
          <div>previous</div>
          <div>play</div>
          <div>pause</div>
          <div>next</div>
          <div>share</div>
        </div>
      </div>
      <div class="summary">
        <div class="titleBar">
          <span>Summarytitle</span>
          <span>Shortcut</span>
        </div>
        <p>Summary Description</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

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
    // return mockSharedArticle;
  } catch (error) {
    console.error("Failed to get article from server:", error);
    throw new Error("Failed to get article from server");
  }
};

export async function GET(request: Request) {
  // return Response.json({ hello: 'world' });
  const url = new URL(request.url);
  const newsId = url.searchParams.get("newsId") || "";
  console.log({ news: newsId });
  const article = await getArticleFromServer(newsId);
  let html = await fs.readFile("./assets/StaticPlayer.html", "utf-8");
  const response = html
    .replaceAll("ARTICLE_TITLE", article.title)
    .replaceAll("ARTICLE_IMAGE", article.image)
    .replaceAll("ARTICLE_DESCRIPTION", article.summary_50)
    .replaceAll("ARTICLE_URL", article.url)
    .replaceAll("ARTICLE_CATEGORIES", JSON.stringify(article.categories))
    .replaceAll(
      "EXPO_PUBLIC_ESSENCE_APP_URL",
      process.env.EXPO_PUBLIC_ESSENCE_APP_URL || "",
    )
    .replaceAll("SOUND_URL", article.audio_summary)
    .replaceAll("PUBLIC_KEY", newsId);

  return new Response(response, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
