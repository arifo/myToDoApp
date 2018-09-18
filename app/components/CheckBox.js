import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

const CheckBox = ({ onPress, text, selected = false }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.box}>
        {selected ? (
          <Image
            style={styles.image}
            source={require("../../img/check.png")}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </TouchableOpacity>
    <Text
      onPress={onPress}
      style={!selected ? styles.text : [styles.text, { fontWeight: "500" }]}
    >
      {text}
    </Text>
  </View>
);

export default CheckBox;

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    borderColor: "#528ff2",
    borderWidth: 3
  },
  image: {
    width: 18,
    height: 18,
    tintColor: "#528ff2"
  },
  text: { fontSize: 14, color: "#528ff2", paddingLeft: 8 }
});
