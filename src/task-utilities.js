// const toposort = require('toposort');

class TaskUtilities {
  constructor(config) {
    this.config = config;
    this.taskTimesCache = {}
  }

  // TODO: Unused
  // findTopologySortedList(tasks) {
  //   const graph = [];
  //
  //   tasks.forEach(task => {
  //     let successors = this.findSuccessorsForTask(tasks, task);
  //     successors.forEach(successorTask => graph.push([task, successorTask]))
  //   });
  //
  //   return toposort(graph);
  // }

  findPredecessorsForTask(tasks, task) {
    return tasks.filter(
      filteredTask => task.ins.some(
        input => filteredTask.outs.includes(input)
      )
    )
  }

  findSuccessorsForTask(tasks, task) {
    return tasks.filter(
      filteredTask => filteredTask.ins.some(
        input => task.outs.includes(input)
      )
    )
  }

  findTasksFromLevel(tasks, level) { return tasks.filter(task => task.level === level); }

  findTasksMaxLevel(tasks) { return Math.max(...tasks.map(task => task.level)); }

  findMaxTaskExecutionTime(task) {
    let times = this.config.functionTypes.map(funcType => task.finishTime[funcType] - task.startTime[funcType]);
    return Math.max(...times);
  }

  findMinTaskExecutionTime(task) {
    let times = this.config.functionTypes.map(funcType => task.finishTime[funcType] - task.startTime[funcType]);
    return Math.min(...times);
  }

  findTaskExecutionTimeOnResource(task, resourceType) {
    return task.finishTime[resourceType] - task.startTime[resourceType];
  }

  findTaskExecutionTime(task) {
    return task.config['scheduledFinishTime'] - task.config['scheduledStartTime'];
  }

  findTaskExecutionCostOnResource(task, resourceType) {
    let time = task.finishTime[resourceType] - task.startTime[resourceType];
    return (Math.ceil(time / 100) * this.config.prices[this.config.provider][resourceType]);
  }

  findPlannedExecutionTime(tasks) {
    const entryTasks = tasks.filter(task => this.findPredecessorsForTask(tasks, task).length === 0);

    let theLongestExecution = 0;
    entryTasks.forEach(task => {
      let pathExecutionTime = this.findExecutionTimeToExitTask(task, tasks);
      if(theLongestExecution < pathExecutionTime) theLongestExecution = pathExecutionTime
    });

    return theLongestExecution;
  }

  findExecutionTimeToExitTask(task, tasks) {
    let taskExecutionTime;
    let sucessors = this.findSuccessorsForTask(tasks, task);
    if(sucessors.length === 0) {
      taskExecutionTime = this.findTaskExecutionTime(task);
    } else {
      taskExecutionTime = (this.findTaskExecutionTime(task) + Math.max(...sucessors.map(t => this.taskTimesCache[t.config.id] || this.findExecutionTimeToExitTask(t, tasks))));
    }

    this.taskTimesCache[task.config.id] = taskExecutionTime;
    return taskExecutionTime;
  }

  findMaxTaskExecutionCost(task) {
    let costs = this.config.functionTypes.map(functionType => this.findTaskExecutionCostOnResource(task, functionType));
    return Math.max(...costs);
  }

  findMinTaskExecutionCost(task) {
    let costs = this.config.functionTypes.map(functionType => this.findTaskExecutionCostOnResource(task, functionType));
    return Math.min(...costs);
  }

  findPredecessorWithLongestFinishTime(predecessors, resourceType) {
    let finishTime = 0;
    let resultTask = {};
    predecessors.forEach(ptask => {
      if (finishTime < ptask.finishTime[resourceType]) {
        finishTime = ptask.finishTime[resourceType];
        resultTask = ptask;
      }
    });
    return resultTask;
  }

  findMaxTaskFinishTime(task) {
    let times = this.config.functionTypes.map(functionType => task.finishTime[functionType]);
    return Math.max(...times)
  }

  findMinTaskFinishTime(task) {
    let times = this.config.functionTypes.map(functionType => task.finishTime[functionType]);
    return Math.min(...times)
  }
}

module.exports = TaskUtilities;