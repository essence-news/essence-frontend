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

export default function SharedNews() {
  const { publicKey } = useLocalSearchParams<{ publicKey: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const articleResponse = await getArticleFromServer(publicKey);
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
    return <ErrorMessage>The shared link appears to be invalid.</ErrorMessage>;
  }
  return <Player sharedArticle={article} />;
}
