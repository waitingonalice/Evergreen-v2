import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";
import ImagePlaceHolder from "public/placeholder_img.svg";

function Image(props: ImageProps) {
  const { src, loading } = props;
  const [url, setURL] = useState(src ?? ImagePlaceHolder);

  const handleError = () => {
    setURL(ImagePlaceHolder);
  };

  return (
    <NextImage
      loading={loading ?? "lazy"}
      onError={handleError}
      {...props}
      src={url}
    />
  );
}

export { Image };
