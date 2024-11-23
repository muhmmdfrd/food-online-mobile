import { FC, useState } from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type ProfileImageProps = {
  code?: string;
  styles?: StyleProp<ImageStyle>;
};

const ProfileImage: FC<ProfileImageProps> = ({ code, styles }) => {
  const [error, setError] = useState<boolean>(false);

  const timestamp = Math.floor(new Date().getTime() / (5 * 60 * 1000));
  const url = `https://files.dapoergo.online/api/files/${code}?v=${timestamp}`;

  return (
    <Image
      style={styles}
      source={{
        uri: code && !error ? url : "https://via.placeholder.com/100",
      }}
      onError={() => setError(true)}
    />
  );
};

export default ProfileImage;
