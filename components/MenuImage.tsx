import { FC, useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type MenuImageProps = {
  size: 50 | 100 | 200;
  code?: string;
  styles?: StyleProp<ImageStyle>;
};

const MenuImage: FC<MenuImageProps> = ({ size, code, styles }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      source={{
        uri:
          code && !error
            ? `https://files.dapoergo.online/api/files/${code}`
            : `https://via.placeholder.com/${size}`,
      }}
      style={styles}
      onError={() => {
        setError(true);
      }}
    />
  );
};

export default MenuImage;
