import React, { Component } from "react";
import { View, Alert, TextInput, Text, Button, ScrollView } from "react-native";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import { connect } from "react-redux";
import RadioButtonsBox from "./components/RadioButtonsBox";
import CheckBox from "./components/CheckBox";
import colors from "../colors";

import { addTask, deleteTask } from "./redux/actions";

class AddNewTask extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "", time: "", priority: "LOW", completed: false };
  }

  componentDidMount() {
    const { type, task } = this.props.navigation.state.params;
    if (type === "edit") {
      this.setState({ ...task });
    }
  }

  onCompleteTask = () => {
    let completed = !this.state.completed;
    this.setState({ completed: completed });
  };

  onDeleteTask = () => {
    const { date, task } = this.props.navigation.state.params;
    this.props.deleteTask(task.id, date);
    this.props.navigation.navigate("List");
  };

  onLowPriority = () => this.setState({ priority: "LOW" });
  onMediumPriority = () => this.setState({ priority: "MEDIUM" });
  onCriticalPriority = () => this.setState({ priority: "CRITICAL" });

  onSaveTask = () => {
    const { time, text, priority } = this.state;
    const { date, type, task } = this.props.navigation.state.params;
    if (!(time && text)) {
      const t = time === "" ? "Pick time" : "";
      const txt = text === "" ? "Write a task" : "";
      Alert.alert("All fields are required", `Please fill ${txt} ${t}`);
      return;
    }

    const newtask = {
      text,
      time,
      priority,
      completed: this.state.completed,
      date: this.props.navigation.state.params.date,
      createdAt: moment().valueOf(),
      id: type === "edit" ? task.id : `${Math.round(Math.random() * 1000000)}`
    };

    const cleanState = {
      text: "",
      time: "",
      priority: "LOW"
    };
    this.props.addTask(newtask, date);
    this.setState({ ...cleanState }, () =>
      this.props.navigation.navigate("List")
    );
  };

  renderEditScreenComponents = () => {
    return (
      <View>
        <View style={styles.separator} />
        <View style={{ marginVertical: 12 }}>
          <Text style={styles.created}>Created</Text>
          <Text
            style={{
              marginLeft: 20
            }}
          >
            {moment(this.state.createdAt).format("MMM Do YYYY, hh:mm:ss")}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.checkbox}>
          <CheckBox
            text="complete"
            selected={this.state.completed}
            onPress={this.onCompleteTask}
          />
        </View>
      </View>
    );
  };

  render() {
    const { type, date } = this.props.navigation.state.params;
    return (
      <View style={styles.modalContent}>
        <ScrollView>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Task for {date}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            autoFocus
            placeholder="Write your task ..."
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
          <View style={styles.separator} />
          <View style={{ paddingLeft: 12 }}>
            <Text style={styles.timePickerLabel}>Time</Text>
            <DatePicker
              showIcon={false}
              style={{ width: 100 }}
              date={this.state.time}
              mode="time"
              placeholder="select time"
              format="HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={styles.dateTimePicker}
              onDateChange={date => {
                console.log("time", date);
                this.setState({ time: date });
              }}
            />
          </View>
          <View style={styles.separator} />
          <RadioButtonsBox
            label="Task priority"
            textOne="Low"
            textTwo="Medium"
            textThree="Critical"
            onPressOne={this.onLowPriority}
            onPressTwo={this.onMediumPriority}
            onPressThree={this.onCriticalPriority}
            selectedOne={this.state.priority === "LOW"}
            selectedTwo={this.state.priority === "MEDIUM"}
            selectedThree={this.state.priority === "CRITICAL"}
          />
          {type === "edit" && this.renderEditScreenComponents()}

          <Button title="save" onPress={this.onSaveTask} />
          <View style={styles.separator} />
          <Button
            title="delete"
            color={colors.pinkLite}
            onPress={this.onDeleteTask}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks
  };
};

export default connect(
  mapStateToProps,
  { addTask, deleteTask }
)(AddNewTask);

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center"
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0dbdb",
    marginHorizontal: 65,
    marginVertical: 5
  },
  modalContent: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 3
  },
  closeImage: {
    width: 20,
    height: 20,
    tintColor: colors.blue
  },
  modalHeader: {
    alignItems: "center",
    paddingVertical: 12
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.blue
  },
  textInput: {
    paddingHorizontal: 15,
    color: "#424242"
  },
  timePickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 15
  },
  dateTimePicker: {
    dateText: {
      color: colors.blue,
      fontSize: 14,
      fontWeight: "500"
    },
    dateInput: {
      marginLeft: 10,
      alignItems: "flex-start",
      borderWidth: 0,
      height: 30
    }
  },
  created: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 12
  },
  checkbox: {
    marginVertical: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row"
  }
};
