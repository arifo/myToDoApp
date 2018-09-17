import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  TextInput,
  FlatList,
  AsyncStorage,
  Alert
} from "react-native";
import moment from "moment";
import CalendarStrip from "react-native-calendar-strip";
import DatePicker from "react-native-datepicker";

import colors from "../colors";
import RadioButtonsBox from "./components/RadioButtonsBox";
import Task from "./components/TaskItem";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
      date: moment().format("dddd, D MMMM"),
      time: "",
      modalVisible: false,
      text: "",
      priority: "LOW",
      datesWhitelist: [
        {
          start: moment(),
          end: moment().add(3, "days") // total 4 days enabled
        }
      ],
      datesBlacklist: [moment().add(1, "days")] // 1 day disabled
    };
  }

  async componentDidMount() {
    await this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const tasks = await AsyncStorage.getItem("@Todoapp:tasks");
      if (tasks !== null) {
        this.setState({ tasks: JSON.parse(tasks) });
      }
    } catch (error) {
      console.log("error getting storage", error);
    }
  };

  _storeData = async item => {
    try {
      await AsyncStorage.setItem("@Todoapp:tasks", JSON.stringify(item));
    } catch (error) {
      console.log("error setting storage", error);
    }
  };

  onAdd = () => {
    this.showModal();
    return console.log("add note");
  };

  onDateSelect = d => {
    const date = d.format("dddd, D MMMM");
    return this.setState({ date });
  };

  showModal = () => this.setState({ modalVisible: true });
  hideModal = () => this.setState({ modalVisible: false });
  onLowPriority = () => this.setState({ priority: "LOW" });
  onMediumPriority = () => this.setState({ priority: "MEDIUM" });
  onCriticalPriority = () => this.setState({ priority: "CRITICAL" });

  onSaveNewTask = async () => {
    const { time, text, priority } = this.state;
    if (!(time && text)) {
      const t = time === "" ? "Pick time" : "";
      const txt = text === "" ? "Write task" : "";
      Alert.alert("All fields are required", `Please fill ${txt} ${t}`);
      return;
    }
    const cleanState = {
      text: "",
      time: "",
      priority: "LOW",
      time: ""
    };
    const task = {
      text,
      time,
      priority,
      completed: false,
      date: this.state.date,
      createdAt: moment().valueOf(),
      id: Math.round(Math.random() * 1000000)
    };

    const tasks = Object.assign({}, this.state.tasks, {
      [this.state.date]: {
        ...this.state.tasks[this.state.date],
        [task.id]: task
      }
    });
    await this._storeData(tasks);
    this.setState(
      {
        tasks,
        ...cleanState
      },
      this.hideModal
    );
  };

  renderAddNewTask = () => {
    return (
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity
              style={{ height: 30, padding: 10 }}
              onPress={this.hideModal}
            >
              <Image
                style={styles.closeImage}
                source={require("../img/close.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>
              Task for {this.state.date}
            </Text>
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
          <View syles={styles.buttonContainer}>
            <Button title="save" onPress={this.onSaveNewTask} />
          </View>
        </View>
      </View>
    );
  };

  onCompleteTask = item => {
    return console.log("complete", item);
  };
  onEditTask = item => {
    return console.log("edit", item);
  };
  onDeleteTask = item => {
    return console.log("edit", item);
  };

  renderTask(item) {
    return (
      <Task
        item={item}
        onComplete={() => this.onCompleteTask(item)}
        onEdit={() => this.onEditTask(item)}
        onDelete={() => this.onDeleteTask(item)}
      />
    );
  }

  renderTasks = data => {
    return (
      <FlatList
        data={data}
        keyExtractor={(i, k) => `${k}`}
        renderItem={({ item }) => this.renderTask(item)}
      />
    );
  };

  renderFooter = () => {
    return (
      <View style={{ backgroundColor: "#fff", flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "grey",
            paddingTop: 15,
            paddingLeft: 15
          }}
        >
          <Text>Info</Text>
        </View>
        <TouchableOpacity style={styles.addIconContainer} onPress={this.onAdd}>
          <Image
            style={styles.addIcon}
            source={require("../img/plus.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderCalendar = () => {
    return (
      <CalendarStrip
        onDateSelected={this.onDateSelect}
        calendarAnimation={{ type: "sequence", duration: 30 }}
        daySelectionAnimation={{
          type: "border",
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: "white"
        }}
        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
        calendarHeaderStyle={{ color: "white" }}
        calendarColor={"#140A26"}
        dateNumberStyle={{ color: "white" }}
        dateNameStyle={{ color: "white" }}
        highlightDateNumberStyle={{ color: "yellow" }}
        highlightDateNameStyle={{ color: "yellow" }}
        disabledDateNameStyle={{ color: "grey" }}
        disabledDateNumberStyle={{ color: "grey" }}
        iconLeft={require("../img/left-arrow.png")}
        iconRight={require("../img/right-arrow.png")}
        iconContainer={{ flex: 0.1 }}
      />
    );
  };

  render() {
    let tasksArray =
      this.state.tasks[this.state.date] &&
      Object.values(this.state.tasks[this.state.date]);
    console.log("this state", this.state, "tasksArray", tasksArray);
    return (
      <View style={styles.container}>
        {this.renderCalendar()}
        <Text style={styles.todayText}>{this.state.date}</Text>
        {this.renderTasks(tasksArray)}
        {this.renderFooter()}

        <Modal
          animationType={"slide"}
          transparent
          onRequestClose={this.hideModal}
          visible={this.state.modalVisible}
        >
          {this.renderAddNewTask()}
        </Modal>
      </View>
    );
  }
}

export default Home;

const styles = {
  container: {
    backgroundColor: "#140A26",
    flex: 1
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0dbdb",
    marginHorizontal: 45,
    marginVertical: 5
  },
  todayText: { color: "#fff", padding: 10, fontWeight: "600", fontSize: 16 },

  addIconContainer: {
    backgroundColor: colors.blue,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",

    margin: 15
    // position: "absolute",
    // bottom: 15,
    // left: 140
  },
  addIcon: {
    width: 35,
    height: 35,
    tintColor: "#fff"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center"
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
  buttonContainer: {
    flexDirection: "row"
  }
};
