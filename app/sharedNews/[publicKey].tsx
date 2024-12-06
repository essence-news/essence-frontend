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
import { View } from "react-native";
import styled from "styled-components/native";
import JoinButton from "@/components/JoinButton";

const StyledErrorMessage = styled(ErrorMessage)`
  margin-top: 75px;
`;

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

  return <Player sharedArticle={article} />;
}
