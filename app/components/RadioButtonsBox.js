import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const RadioButton = ({ onPress, text, selected = false }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.roundBorder}>
        {selected ? <View style={styles.roundInner} /> : null}
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

const RadioButtonsBox = ({
  label,
  onPressOne,
  onPressTwo,
  onPressThree,
  textOne,
  textTwo,
  textThree,
  selectedOne = false,
  selectedTwo = false,
  selectedThree = false
}) => (
  <View style={styles.container}>
    <Text style={styles.priorityText}>{label}</Text>

    <View style={styles.priorityButtons}>
      <RadioButton text={textOne} onPress={onPressOne} selected={selectedOne} />
      <RadioButton text={textTwo} onPress={onPressTwo} selected={selectedTwo} />
      <RadioButton
        text={textThree}
        onPress={onPressThree}
        selected={selectedThree}
      />
    </View>
  </View>
);

export default RadioButtonsBox;

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  roundBorder: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "transparent",
    borderColor: "#528ff2",
    borderWidth: 3
  },
  roundInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#528ff2"
  },
  text: { fontSize: 14, color: "#528ff2", paddingLeft: 8 },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 15,
    paddingLeft: 12
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15
  }
});
