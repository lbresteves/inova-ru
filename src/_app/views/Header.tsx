import { Text, View } from "react-native";

const Header = () => {
  return (
    <View
      style={{
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderBottomWidth: 1,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Header</Text>
    </View>
  );
};

export default Header;
