import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import CalendarStrip from "react-native-calendar-strip";
import SegmentControl from "react-native-segment-controller";

import colors from "../colors";
import Task from "./components/TaskItem";

import { deleteTask, completeTask } from "./redux/actions";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
      date: moment().format("dddd, D MMMM"),
      index: 0
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onAdd = () => {
    this.props.navigation.navigate("Add", {
      title: "Add new task",
      date: this.state.date,
      tasks: this.state.tasks
    });
  };

  onDateSelect = d => {
    const date = d.format("dddd, D MMMM");
    return this.setState({ date });
  };

  onCompleteTask = item => {
    this.props.completeTask(item, this.state.date);
  };
  onDeleteTask = item => {
    this.props.deleteTask(item.id, this.state.date);
  };
  onViewTask = item => {
    this.props.navigation.navigate("Add", {
      type: "edit",
      title: "View task",
      task: item,
      date: this.state.date
    });
  };

  handleTabSwitch = index => this.setState({ index });

  renderTask(item, key) {
    return (
      <Task
        key={key}
        item={item}
        onComplete={() => this.onCompleteTask(item)}
        onEdit={() => this.onViewTask(item)}
        onDelete={() => this.onDeleteTask(item)}
      />
    );
  }

  renderFooter = tasksArray => {
    const taskCount = `${tasksArray.length}`;
    const completed = tasksArray.filter(val => val.completed === true);
    const lowPriorityTasks = tasksArray.filter(val => val.priority === "LOW");
    const low = lowPriorityTasks.length;
    const midPriorityTasks = tasksArray.filter(
      val => val.priority === "MEDIUM"
    );
    const mid = midPriorityTasks.length;
    const highPriorityTasks = tasksArray.filter(
      val => val.priority === "CRITICAL"
    );
    const high = highPriorityTasks.length;
    return (
      <View style={{ flexDirection: "row" }}>
        {tasksArray && (
          <View style={styles.footerTextContainer}>
            <Text style={{ color: "#fff" }}>
              Tasks completed: {`${completed.length}/${taskCount}`}
            </Text>
            <Text style={{ color: "#fff" }}>Priorities: </Text>
            <Text>
              <Text style={{ color: colors.pink }}>High: {high}</Text>/
              <Text style={{ color: colors.purpleDeep }}>Mid: {mid}</Text>/
              <Text style={{ color: colors.greenLite }}>Low: {low}</Text>
            </Text>
          </View>
        )}

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
        highlightDateNumberStyle={{ color: colors.blue }}
        highlightDateNameStyle={{ color: colors.blue }}
        disabledDateNameStyle={{ color: "grey" }}
        disabledDateNumberStyle={{ color: "grey" }}
        iconLeft={require("../img/left-arrow.png")}
        iconRight={require("../img/right-arrow.png")}
        iconContainer={{ flex: 0.1 }}
      />
    );
  };

  render() {
    const tasksArr = this.props.tasks[this.state.date]
      ? Object.values(this.props.tasks[this.state.date])
      : [];
    const completed = tasksArr.filter(val => val.completed === true);
    const active = tasksArr.filter(val => val.completed === false);
    const tasks = this.state.index === 0 ? active : completed;
    const lowPriorityTasks = tasks.filter(val => val.priority === "LOW");
    const midPriorityTasks = tasks.filter(val => val.priority === "MEDIUM");
    const highPriorityTasks = tasks.filter(val => val.priority === "CRITICAL");

    return (
      <View style={styles.container}>
        {this.renderCalendar()}
        <Text style={styles.todayText}>{this.state.date}</Text>
        <View style={{ flex: 1 }}>
          <SegmentControl
            values={["Active", "Completed"]}
            badges={[active.length, completed.length]}
            selectedIndex={this.state.index}
            height={30}
            onTabPress={this.handleTabSwitch.bind(this)}
            activeTabStyle={{ backgroundColor: colors.blue }}
            borderRadius={5}
          />
          <ScrollView>
            {highPriorityTasks.map((val, key) => this.renderTask(val, key))}
            {midPriorityTasks.map((val, key) => this.renderTask(val, key))}
            {lowPriorityTasks.map((val, key) => this.renderTask(val, key))}
          </ScrollView>
        </View>
        {this.renderFooter(tasksArr)}
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
  { deleteTask, completeTask }
)(Home);

const styles = {
  container: {
    backgroundColor: "#140A26",
    flex: 1
  },
  todayText: { color: "#fff", padding: 10, fontWeight: "600", fontSize: 16 },
  addIconContainer: {
    backgroundColor: colors.blue,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    margin: 15
  },
  addIcon: {
    width: 35,
    height: 35,
    tintColor: "#fff"
  },
  footerTextContainer: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 15
  }
};
