import { Image } from "react-native";

const Logo = () => {
  return (
    <Image
      source={require("../../../assets/images/ru-mark.png")}
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
