/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useState } from "react";
import { useInfiniteImages } from "../hooks/useInfiniteImages";
import Image from "./Image";

const ImagesGrid = () => {
  const {
    data: initialData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteImages();
  const [data, setData] = useState(initialData || undefined);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleDeleteImage = (imageId: React.Key | null | undefined) => {
    // @ts-expect-error
    setData((prevData) => {
      const updatedPages =
        prevData?.pages.map((page) => ({
          ...page,
          items: page.items.filter(
            (image: { id: React.Key | null | undefined }) =>
              image.id !== imageId
          ),
        })) || [];

      return {
        ...prevData,
        pages: updatedPages,
      };
    });
  };

  return (
    <div>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.items.map(
              (image: {
                id: React.Key | null | undefined;
                url: string;
                width: number;
                height: number;
                stats: {
                  cryCount: number;
                  laughCount: number;
                  likeCount: number;
                  dislikeCount: number;
                  heartCount: number;
                  commentCount: number;
                };
              }) => (
                <div key={image.id} className="mb-4 break-inside-avoid">
                  <Image
                    src={image.url}
                    alt=""
                    width={image.width}
                    height={image.height}
                    stats={image.stats}
                    onDelete={() => handleDeleteImage(image.id)}
                  />
                </div>
              )
            )}
          </React.Fragment>
        ))}
      </div>
      {(isFetchingNextPage || isFetching) && (
        <div className="flex justify-center items-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      <div ref={loadMoreRef} className="h-5" />
    </div>
  );
};

export default ImagesGrid;
