

let canvas = document.querySelector('canvas#gridworld')

let rows = 10
let cols = 10
let block_size = 25
let snake_X = Math.floor(Math.random() * rows)
let snake_Y = Math.floor(Math.random() * cols)

let snakeBody = []
snakeBody[0] = [snake_X, snake_Y] // Initialize the head
let score = 0


function Initialize()
{ 

    
canvas.width = rows * block_size
canvas.height = cols * block_size

 snake_X = Math.floor(Math.random() * rows)
 snake_Y = Math.floor(Math.random() * cols)

 food_x = Math.floor(Math.random() * rows)
 food_y = Math.floor(Math.random() * cols)

 score = 0


ctx.fillStyle = 'black'
ctx.fillRect(0, 0, rows * block_size, cols * block_size)
fillSnake()
fillFood()

}

let food_x = Math.floor(Math.random() * rows)
let food_y = Math.floor(Math.random() * cols)

canvas.width = rows * block_size
canvas.height = cols * block_size

let ctx = canvas.getContext('2d')

ctx.fillStyle = 'black'
ctx.fillRect(0, 0, rows * block_size, cols * block_size)
fillSnake()
fillFood()

function updateBoard() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, rows * block_size, cols * block_size)
    fillFood();
    fillSnake();
}

function fillSnake() {
    ctx.fillStyle = 'blue'
    // Draw all segments of the snake
    snakeBody.forEach(segment => {
        ctx.fillRect(segment[0] * block_size, segment[1] * block_size, block_size, block_size)
    })
}

function fillFood() { 

    ctx.fillStyle = 'green'
    ctx.fillRect(food_x * block_size, food_y * block_size, block_size, block_size)
}



// window.addEventListener('keydown', e => {
//     moveSnake(e.key)
// })

let scoreSpan = document.querySelector('#score')

function checkFoodEaten() {
    if (snake_X === food_x && snake_Y === food_y) {
        food_x = Math.floor(Math.random() * rows)
        food_y = Math.floor(Math.random() * cols)
        // Increase snake length when food is eaten
        snakeBody.push([...snakeBody[snakeBody.length - 1]]) // Add a new segment to the body
        score += 10
    }
    scoreSpan.innerHTML = score;
}

function updateSnakeBody() {
    // Shift the snake body to follow the head
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = [...snakeBody[i - 1]]; // Copy previous segment
    }
    // Update the head
    snakeBody[0] = [snake_X, snake_Y];
}

function moveSnake(action) {
    switch (action) {
        case 'up': {
            snake_Y = Math.max(0, snake_Y - 1)
        } break;
        case 'down': {
            snake_Y = Math.min(cols - 1, snake_Y + 1)
        } break;
        case 'left': {
            snake_X = Math.max(0, snake_X - 1)
        } break;
        case 'right': {
            snake_X = Math.min(rows - 1, snake_X + 1)
        } break;
    }

    updateSnakeBody();  // Update the snake's body to move
    checkFoodEaten();   // Check if food has been eaten
    updateBoard();      // Redraw the board
}


let dimensions_element = document.getElementById('dimensions')

dimensions_element.addEventListener('input', setDimensions);

function setDimensions(e)
{
    let value = e.target.value;
    value = value.split('x')
    rows = parseInt(value[0])
    cols = parseInt(value[1])

    Initialize();

   
}


document.getElementById('play').addEventListener('click', play)

 function play()
{
setInterval(() => {

    function getMaxObj(obj) {
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
   
    let url = rows + 'x' + cols + '.json'


    fetch(url)
    .then(res=> res.json())
    .then(qtable =>{



        let position = [[snake_X, snake_Y], [food_x, food_y]];
        let positionString = JSON.stringify(position);
    
        // Check if the current position exists in Q-table
        if (qtable && qtable[positionString]) {
            let move = getMaxObj(qtable[positionString]);
            moveSnake(move);
        } else {
            // If no matching entry in Q-table, move randomly or perform a fallback action
            let randomMove = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
            moveSnake(randomMove);
        }

    })

  


}, 300);
}

