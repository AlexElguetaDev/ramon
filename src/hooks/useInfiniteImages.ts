import { useInfiniteQuery } from "react-query";
import axios from "axios";

const fetchImages = async ({ pageParam = null }) => {
  const endpoint = `https://civitai.com/api/v1/images`;
  const params = {
    limit: 20,
    cursor: pageParam,
    sort: "Most Reactions",
    period: "Week",
    nsfw: "None",
  };

  const response = await axios.get(endpoint, { params });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return response.data;
};

export const useInfiniteImages = () => {
  return useInfiniteQuery("images", fetchImages, {
    getNextPageParam: (lastPage) => {
      return lastPage.metadata.nextCursor;
    },
  });
};
