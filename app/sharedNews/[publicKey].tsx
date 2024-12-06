import { useLocalSearchParams } from "expo-router";
import Player from "../player";
import { useEffect, useState } from "react";
import { getArticleFromServer } from "@/utils/api";
import { Article } from "@/utils/types";
import {
  ErrorMessage,
  StyledActivityIndicator,
} from "@/components/SharedComponents";
import theme from "@/constants/theme";
import BrandHeader from "@/components/BrandHeader";
import { Platform, View } from "react-native";
import styled from "styled-components/native";
import JoinButton from "@/components/JoinButton";
import { updateMetaTag } from "@/utils/commonUtils";
import { Helmet } from "react-helmet";

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: 75px;
`;

export default function SharedNews() {
  const { publicKey } = useLocalSearchParams<{ publicKey: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  const setMetaTags = (article: Article) => {
    updateMetaTag("og:title", article.title);
    updateMetaTag("og:url", article.url);
    updateMetaTag("og:description", article.summary_50);
    updateMetaTag("og:image", article.image || "");
  };

  useEffect(() => {
    const getArticle = async () => {
      try {
        const articleResponse = await getArticleFromServer(publicKey);
        // setMetaTags(articleResponse);
        setArticle(articleResponse);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, []);

  if (loading)
    return (
      <StyledActivityIndicator size="large" color={theme.colors.primary} />
    );
  if (error || !article) {
    return (
      <View>
        <BrandHeader />
        <View style={{ zIndex: 11, position: "absolute", right: 20, top: 22 }}>
          <JoinButton />
        </View>
        <StyledErrorMessage>
          The shared link appears to be invalid.
        </StyledErrorMessage>
      </View>
    );
  }

  return (
    <>
      {Platform.OS === "web" && (
        <Helmet>
          <meta property="og:title" content={article.title} />
          <meta property="og:url" content={article.url} />
          <meta property="og:description" content={article.summary_50} />
          <meta property="og:image" content={article.image || ""} />
        </Helmet>
      )}
      <Player sharedArticle={article} />
    </>
  );
}
