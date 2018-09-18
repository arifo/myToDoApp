const initialState = {
  tasks: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "Add": {
      return {
        tasks: {
          ...state.tasks,
          [action.date]: {
            ...state.tasks[action.date],
            [action.task.id]: action.task
          }
        }
      };
    }
    case "Delete": {
      const updatedTasks = removeTask(state.tasks[action.date], action.id);
      return {
        tasks: {
          ...state.tasks,
          [action.date]: updatedTasks
        }
      };
    }
    case "Complete": {
      return {
        tasks: {
          ...state.tasks,
          [action.date]: {
            ...state.tasks[action.date],
            [action.id]: action.completedTask
          }
        }
      };
    }

    default:
      return state;
  }
};

const removeTask = (obj, id) =>
  Object.keys(obj).reduce((acc, key) => {
    if (key !== id) {
      return { ...acc, [key]: obj[key] };
    }
    return acc;
  }, {});

// const obj = this.state.tasks[this.state.date];
// const tasks = Object.keys(obj).reduce((acc, key) => {
//   if (key !== `${item.id}`) {
//     return { ...acc, [key]: obj[key] };
//   }
//   return acc;
// }, {});
// const updatedTasks = {
//   ...this.state.tasks,
//   [this.state.date]: tasks
// };
// this.setState({ tasks: updatedTasks });
