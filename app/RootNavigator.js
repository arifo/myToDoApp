import { createStackNavigator } from "react-navigation";

import AddNewTask from "./AddNewTask";
import TaskList from "./TaskList";

export default createStackNavigator(
  {
    Add: {
      screen: AddNewTask,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.state.params.title
      })
    },
    List: {
      screen: TaskList,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "List"
  }
);
