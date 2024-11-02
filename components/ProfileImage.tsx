import { FC, useState } from "react";
import { Image } from "react-native";

type ProfileImageProps = {
  code?: string;
};

const ProfileImage: FC<ProfileImageProps> = ({ code }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
      }}
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
