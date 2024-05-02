import React, { useState } from "react";

interface ImageProps {
  src: string;
  alt?: string;
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
  onDelete: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  stats,
  onDelete,
}) => {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = (height / width) * 100;

  const [menuVisible, setMenuVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const downloadImage = async () => {
    try {
      const imageFetch = await fetch(src);
      const imageBlob = await imageFetch.blob();
      const imageURL = window.URL.createObjectURL(imageBlob);

      const link = document.createElement("a");
      link.href = imageURL;
      link.download = alt || "image";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(imageURL);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) {
      setMenuVisible(false);
    }
  };

  return (
    <div
      style={{
        paddingBottom: `${aspectRatio}%`,
      }}
      className="rounded-xl overflow-hidden border-2 border-gray-300 relative"
    >
      <img
        src={src}
        alt={alt || ""}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        style={{
          display: loaded ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
          isZoomed ? "" : "hidden"
        }`}
        onClick={toggleZoom}
      >
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={toggleZoom}
          className="absolute top-0 right-0 text-white text-2xl p-2"
        >
          &times;
        </button>
      </div>
      <div className="absolute top-1 right-2">
        <button
          onClick={toggleMenu}
          className="text-white backdrop-filter backdrop-blur-md rounded-md"
        >
          ︙
        </button>
        {menuVisible && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
            <ul className="py-1">
              <li>
                <button
                  onClick={toggleZoom}
                  className="block px-4 py-2 min-w-full text-sm text-gray-700 hover:bg-gray-100"
                >
                  Ver en grande
                </button>
              </li>
              <li>
                <button
                  onClick={downloadImage}
                  className="block px-4 py-2 min-w-full text-sm text-gray-700 hover:bg-gray-100"
                >
                  Descargar
                </button>
              </li>
              <li>
                <button
                  onClick={onDelete}
                  className="block px-4 py-2 min-w-full text-sm text-gray-700 hover:bg-gray-100"
                >
                  Borrar
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="absolute bottom-1 left-2 right-2 rounded-lg flex justify-center items-center space-x-2 p-2 bg-black bg-opacity-50 text-white backdrop-filter backdrop-blur-md flex-wrap">
        {Object.entries(stats).map(([key, value]) => {
          const icons: { [key: string]: string } = {
            cryCount: "😢",
            laughCount: "😂",
            likeCount: "👍",
            dislikeCount: "👎",
            heartCount: "❤️",
            commentCount: "💬",
          };

          const icon = icons[key];

          return (
            <div key={key} className="flex items-center text-[8px] sm:text-xs">
              <span className="pl-2">
                {icon} {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Image;
