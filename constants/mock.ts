export const mockResponse = `<!doctype html>
<html lang="en-GB" itemscope itemtype="http://schema.org/WebPage">
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
    <meta name="twitter:title" content="TITLE">
    <meta name="twitter:description" content="DESCRIPTION">  
    <meta name="twitter:creator" content="@CREATOR">
    <meta name="twitter:image" content="IMAGE_FOR_TWITTER_CARD">
    <!-- Open Graph data http://ogp.me/ -->
    <meta property="og:title" content="ARTICLE_TITLE" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="ARTICLE_URL" />
    <meta property="og:image" content="ARTICLE_IMAGE" />
    <meta property="og:description" content="ARTICLE_DESCRIPTION">
    <meta property="og:site_name" content="Essence" />
    <meta property="og:locale" content="en_US">
</head>
<script>
  function goToArticlePage() {
      // window.location.href = "https://develop.d2f7pba6ta58v6.amplifyapp.com/sharedNews/PUBLIC_KEY_HERE"
  }
</script>
<body onload="goToArticlePage()">
<iframe height="500px" width="1000px" src="https://develop.d2f7pba6ta58v6.amplifyapp.com/sharedNews/PUBLIC_KEY_HERE">
ARTICLE_TITLE
</body>    
</html>`;

export const mockNewsData = {
  articles: [
    {
      article_id:
        "c7642db3e716d70b62cda318f7804182bdd5d8002d286d974368107882a07f20",
      audio_summary:
        "https://essence-news.s3.amazonaws.com/live/c7642db3e716d70b62cda318f7804182bdd5d8002d286d974368107882a07f20/en-UK-False.mp3?AWSAccessKeyId=AKIAUWF6I5PZFWK4M3PL&Signature=1Lva3ly3KkDfGXL3cSe0USWEE7c%3D&Expires=1733214812",
      categories: ["Grocery", "Consumer Trends", "Business Strategy"],
      date_created: "Tue, 26 Nov 2024 07:33:05 GMT",
      date_published: "Tue, 26 Nov 2024 00:16:50 GMT",
      domain: "pressdemocrat.com",
      image:
        "https://imengine.prod.srp.navigacloud.com/?uuid=330c3ca2-8608-5cb0-b6ce-9f9ad28697f8&type=primary&q=75&width=1600",
      importance_score: 0,
      is_from_preferred_source: false,
      score: 0,
      source_name: "topic_grocery_uk",
      summary_200:
        "Oliver’s Market, a beloved grocery chain in Sonoma County, has officially become 100% employee-owned, marking a significant transition in its ownership structure. Founded by Steve Maass in 1988, the chain previously sold 43% of its shares to employees in 2017, finalizing the sale of the remaining 57% on October 31, 2024. The employees now own their shares through an employee stock ownership plan (ESOP), which functions similarly to a retirement plan, allowing for annual allocations of shares at no cost. Maass, committed to maintaining the store's independence, emphasized the importance of community partnerships and preserving local jobs over selling to larger chains. With over 900 employees, many of whom have been with the company for over two decades, Oliver's Market prides itself on its unique employee-driven culture. General Manager Scott Gross noted that this decision reflects a dedication to job preservation. The move solidifies Oliver's Market's role as a vital part of the community, ensuring that it remains a local staple rather than succumbing to corporate ownership.",
      summary_50:
        "Oliver’s Market, a Sonoma County grocery chain, has transitioned to 100% employee ownership. Founded in 1988 by Steve Maass, the chain's employee stock ownership plan allows workers to gain shares at no cost. This decision aims to preserve the store's local independence and community ties.",
      title: "Oliver’s Market Becomes Fully Employee-Owned",
      type: "ecommerce",
      url: "https://www.pressdemocrat.com/article/north-bay/olivers-market-sonoma-employee-ownership/",
      user_id: "175c5a0f-4230-424a-b836-2c3f52eeaa94",
    },
    {
      article_id:
        "82f3b7e61d02aeff58f1cb272a93b7c8ec6fe9743e87ccbaf829b9594ff3b070",
      audio_summary:
        "https://essence-news.s3.amazonaws.com/live/82f3b7e61d02aeff58f1cb272a93b7c8ec6fe9743e87ccbaf829b9594ff3b070/en-UK-True.mp3?AWSAccessKeyId=AKIAUWF6I5PZFWK4M3PL&Signature=%2FMjt1PTAMMxHfx%2FiMC8U%2BgCwwJA%3D&Expires=1733214812",
      categories: ["Fashion", "Consumer Trends", "Retail Tech"],
      date_created: "Tue, 26 Nov 2024 07:33:05 GMT",
      date_published: "Tue, 26 Nov 2024 00:02:08 GMT",
      domain: "uk.fashionnetwork.com",
      image:
        "https://media.fashionnetwork.com/cdn-cgi/image/fit=cover,width=600,height=600,format=auto/m/42bd/4918/8384/9f40/898d/2d20/3230/3b87/7202/9c12/9c12.jpg",
      importance_score: 0,
      is_from_preferred_source: false,
      score: 0,
      source_name: "uk.fashionnetwork.com",
      summary_200:
        "The Emerging Talents Milan event presented the Women's Spring/Summer 2025 collections, featuring a variety of innovative designs from new and established designers. This event underscores Milan's significant position in the global fashion scene, as it provides a platform for emerging talents to showcase their creativity and vision. By focusing on women's fashion, the event not only highlights fresh perspectives but also contributes to the industry's evolution. Designers from various backgrounds participated, enriching the diversity of styles and ideas presented. This initiative plays a crucial role in shaping future trends and fostering the growth of new talent in the competitive fashion landscape.",
      summary_50:
        "The Emerging Talents Milan event showcased Women's Spring/Summer 2025 collections, highlighting innovative designs from various designers. This event emphasizes Milan's role in fashion and promotes new talents in the industry, contributing to the ongoing evolution of women's fashion.",
      title: "Emerging Talents Milan Showcases Women's SS 2025 Collections",
      type: "ecommerce",
      url: "https://uk.fashionnetwork.com/videos/video/29458,Emerging-talents-milan-women-ss-2025-milano.html",
      user_id: "175c5a0f-4230-424a-b836-2c3f52eeaa94",
    },
  ],
  count: 2,
  intro_audio:
    "https://essence-news.s3.amazonaws.com/live/175c5a0f-4230-424a-b836-2c3f52eeaa94/intro/False_False_morning.mp3?AWSAccessKeyId=AKIAUWF6I5PZFWK4M3PL&Signature=SkMi%2B7U7otk44YcHDpV4JP6zLTg%3D&Expires=1733214812",
};

export const mockSharedArticle = {
  audio_summary:
    "https://essence-news.s3.amazonaws.com/dev/06f65592619cefe59c5b5b03704f2597610a99d0a25d7db1367c6bcf758a9fcd/en-UK-False.mp3?AWSAccessKeyId=AKIAUWF6I5PZFWK4M3PL&Signature=9nNw9BVedLZpY6JFYp2TdidzoM4%3D&Expires=1734319132",
  categories: ["Grocery", "Consumer Trends", "Retail Tech"],
  date_created: "2024-12-06T09:01:01.370734+00:00",
  date_published: "2024-12-04T17:55:21+00:00",
  domain: "nbcdfw.com",
  full_text: null,
  function: "Marketing",
  id: "06f65592619cefe59c5b5b03704f2597610a99d0a25d7db1367c6bcf758a9fcd",
  image:
    "https://media.nbcdfw.com/2024/12/heb.jpg?quality=85&strip=all&resize=1200,675",
  industry: "Grocery",
  processing_status: "audio_summary_generated",
  public_key: "5bc20cd4",
  region: "United States",
  rss_summary: "The grocery game is heating up in North Texas.",
  single_news_item: true,
  source_name: "grocerydive",
  summary_200:
    "H-E-B is making significant strides in North Texas, opening multiple new grocery stores and challenging established competitors such as Kroger, Tom Thumb, and Walmart. The grocery landscape is becoming increasingly competitive, influenced by the region's population boom and a robust local economy. H-E-B has recently broken ground on new locations in Euless/Bedford, Rockwall, Irving, Prosper, Murphy, and Melissa, with openings planned for 2025 and 2026. The Texas Retailers Association notes that this competition will likely lead to improvements in customer service and loyalty programs among existing stores. Kroger is renovating its locations and exploring new openings, while Tom Thumb focuses on loyalty initiatives. Walmart is enhancing its curbside pickup and home delivery services. The DFW grocery market generates an estimated $20 billion annually, making it one of the highest in the country. Experts anticipate that 2025 will see further technological advancements and competitive pricing strategies as stores adapt to maintain customer loyalty in this evolving landscape.",
  summary_50:
    "H-E-B expands aggressively in North Texas, opening new stores and intensifying competition with Kroger, Tom Thumb, and Walmart. Experts predict a reshaping of the local grocery landscape, driven by population growth and economic factors, with a projected $20 billion in annual grocery sales in the DFW market.",
  summary_vector: null,
  title: "Grocery Wars Intensify in North Texas with H-E-B Expansion",
  type: "ecommerce",
  url: "https://www.nbcdfw.com/news/local/grocery-wars-heat-up-in-north-texas-as-h-e-b-challenges-local-heavyweights/3711580/",
};
