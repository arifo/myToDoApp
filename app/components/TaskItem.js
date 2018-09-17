import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import colors from "../../colors";

const Task = ({ item, onComplete, onEdit, onDelete }) => {
  let checkPriority = "";
  switch (item.priority) {
    case "LOW":
      checkPriority = colors.greenLite;
      break;
    case "MEDIUM":
      checkPriority = colors.purpleDeep;
      break;
    case "CRITICAL":
      checkPriority = colors.pink;
      break;
  }
  return (
    <View style={[styles.noteContainer, { backgroundColor: checkPriority }]}>
      <View style={styles.textContainer}>
        <Text style={styles.noteText}>{item.time}</Text>
        <Text style={styles.noteText}>{item.text}</Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={item => onComplete(item)}>
          <Image
            style={styles.image}
            source={require("../../img/check.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={item => onEdit(item)}>
          <Image
            style={styles.image}
            source={require("../../img/pencil.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={item => onDelete(item)}>
          <Image
            style={styles.image}
            source={require("../../img/trash.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;

const styles = {
  noteContainer: {
    backgroundColor: colors.blue,
    flexDirection: "row",
    margin: 8,
    borderRadius: 4,
    justifyContent: "space-between"
  },
  noteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    paddingLeft: 10,
    textAlign: "left",
    textShadowColor: "#000",
    textShadowRadius: 1
  },
  textContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    flex: 0.8
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginRight: 10,
    flex: 0.2
  },
  image: {
    width: 18,
    height: 18,
    tintColor: "#fff",
    marginHorizontal: 4
  }
};
