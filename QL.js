
class Agent {
  constructor(numEpisodes, rows, cols) {
      this.qtable = {}
      this.numEpisodes = numEpisodes;
      this.rows = rows;
      this.cols = cols;
      this.epsilon = 0.2;
      this.alpha = 0.1;
      this.gamma = 0.9;
      this.actions = ['up', 'down', 'left', 'right'];
  }

  get_next_state(currState, action) {
      const [x, y] = currState[0];

      switch(action) {
          case 'up':
              return [[x, Math.max(0, y - 1)], currState[1]];
          case 'down':
              return [[x, Math.min(this.cols - 1, y + 1)], currState[1]];
          case 'left':
              return [[Math.max(0, x - 1), y], currState[1]];
          case 'right':
              return [[Math.min(this.rows - 1, x + 1), y], currState[1]];
      }
  }

  getMaxObj(obj) {
      let maxKey = null;
      let maxValue = -Infinity;

      for (let key in obj) {
          if (obj[key] > maxValue) {
              maxValue = obj[key];
              maxKey = key;
          }
      }

      return maxKey;
  }

  chooseAction(currState) {
      if (Math.random() < this.epsilon) {
          return this.actions[Math.floor(Math.random() * this.actions.length)];
      }
      
      this.initQTable(currState);
      let objValues = this.qtable[JSON.stringify(currState)];
      return this.getMaxObj(objValues);
  }

  initQTable(state) {
      let stateKey = JSON.stringify(state);

      if (!this.qtable[stateKey]) {
          this.qtable[stateKey] = { 'up': 0, 'down': 0, 'left': 0, 'right': 0 };
      }
  }

  // Manhattan distance calculation between two points
  calculateDistance(pos1, pos2) {
      return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
  }

  updateQTable(currPosition, nextPosition, action, reward) {
      this.initQTable(currPosition);
      this.initQTable(nextPosition);

      let currQ = this.qtable[JSON.stringify(currPosition)][action];
      let maxKeyFuture = this.getMaxObj(this.qtable[JSON.stringify(nextPosition)]);
      let maxValueFuture = this.qtable[JSON.stringify(nextPosition)][maxKeyFuture];

      // Q-learning formula
      this.qtable[JSON.stringify(currPosition)][action] = currQ + this.alpha * (reward + this.gamma * maxValueFuture - currQ);
  }

  train() {
      for (let i = 0; i < this.numEpisodes; i++) {
          let snake_X = Math.floor(Math.random() * this.rows);
          let snake_Y = Math.floor(Math.random() * this.cols);
          let food_X = Math.floor(Math.random() * this.rows);
          let food_Y = Math.floor(Math.random() * this.cols);

          let currState = [[snake_X, snake_Y], [food_X, food_Y]];

          while (snake_X !== food_X || snake_Y !== food_Y) {
              let action = this.chooseAction(currState);
              let nextState = this.get_next_state(currState, action);

              // Manhattan distances
              let currDistance = this.calculateDistance(currState[0], currState[1]);
              let nextDistance = this.calculateDistance(nextState[0], nextState[1]);

              // Reward system: +10 for reaching the food, +1 for moving closer, -1 for moving farther
              let reward;
              if (nextState[0][0] === nextState[1][0] && nextState[0][1] === nextState[1][1]) {
                  reward = 10; // Reached the food
              } else if (nextDistance < currDistance) {
                  reward = 1;  // Moved closer to food
              } else {
                  reward = -1; // Moved farther from food
              }

              // Update Q-table
              this.updateQTable(currState, nextState, action, reward);

              // Update the current state and snake position
              snake_X = nextState[0][0];
              snake_Y = nextState[0][1];
              currState = nextState;

              // If the snake has reached the food, break the loop to end the episode
              if (snake_X === food_X && snake_Y === food_Y) {
                  break;
              }
          }
      }
  }

  printQTable() {
      //console.log(this.qtable);
      //sessionStorage.setItem(name, JSON.stringify(this.qtable))

      return JSON.stringify(this.qtable);
  }
}





// let download = document.getElementById('download')
// console.log("element is " + download)
//  let li = [ [10,10], [15,15], [20,10], [20,15] ]


// download.addEventListener('click', ()=>{
 
//    for(let l of li)
//    {
//     download_list(l)
//    }
// })



// function download_list(list)
// {

//     const link = document.createElement('a')
//     let agent = new Agent(30000, list[0], list[1])
//     agent.train()
//     console.log('done training')
//     const content = agent.printQTable();
//     const file = new Blob([content], {type: "application/json"});
//     link.href = URL.createObjectURL(file)
//     let name = list[0] + 'x' + list[1] + '.json'
//     link.download = name
//     link.click();
//     URL.revokeObjectURL(link.href)
//     console.log(name)
// }



