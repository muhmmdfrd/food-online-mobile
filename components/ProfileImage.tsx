import { FC, useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type ProfileImageProps = {
  code?: string;
  styles?: StyleProp<ImageStyle>;
};

const ProfileImage: FC<ProfileImageProps> = ({ code, styles }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      style={styles}
      source={{
        uri:
          code && !error
            ? `https://files.dapoergo.online/api/files/${code}`
            : "https://via.placeholder.com/100",
      }}
      onError={() => setError(true)}
    />
  );
};

export default ProfileImage;
