import { useInfiniteQuery } from "react-query";
import axios from "axios";


const fetchImages = async ({ pageParam = null }) => {
  const endpoint =
    import.meta.env.VITE_API_URL || `https://civitai.com/api/v1/images`;
  const params = {
    limit: import.meta.env.VITE_LIMIT || 20,
    cursor: pageParam,
    sort: import.meta.env.VITE_SORT || "Most Reactions",
    period: import.meta.env.VITE_PERIOD || "Week",
    nsfw: import.meta.env.VITE_NSFW || "None",
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
