export const addTask = (task, date) => {
  return {
    type: "Add",
    task,
    date
  };
};

export const deleteTask = (id, date) => {
  return {
    type: "Delete",
    id,
    date
  };
};
export const completeTask = (task, date) => {
  const completedTask = Object.assign({}, task);
  completedTask.completed = true;
  return {
    type: "Complete",
    id: task.id,
    completedTask,
    date
  };
};
