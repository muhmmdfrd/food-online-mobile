import { FC, useState } from "react";
import { Image } from "react-native";

type MenuImageProps = {
  code?: string;
};

const MenuImage: FC<MenuImageProps> = ({ code }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      source={{
        uri:
          code && !error
            ? `https://files.dapoergo.online/api/files/${code}`
            : "https://via.placeholder.com/100",
      }}
      style={{
        width: 100,
        height: 100,
        borderRadius: 10,
      }}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default MenuImage;
