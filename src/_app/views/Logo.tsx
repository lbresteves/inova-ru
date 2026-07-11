import { Image } from "react-native";

const Logo = () => {
  return (
    <Image
      source={require("../../../assets/images/favicon.png")}
      style={{
        width: 40,
        height: 40,
        objectFit: "contain",
        marginHorizontal: 16,
      }}
    />
  );
};

export default Logo;
