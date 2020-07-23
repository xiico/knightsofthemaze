
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#000';
var cell;
var line;
var start = 0;
var useMaze2 = false;
var shape;
var complexity;
var density;
var iComplexity = 0;
var iDensity = 0;
var x = 0;
var y = 0;
var colSize = 4;
var rowSize = 4;
var roomSize = 5;
var count = 0;
// var size = 47;//39
var seed;// = Math.random();
var seeded;// = new Math.seedrandom(seed);
var lastRnd;
function main(){    
    count++;
    if(count % 30 == 0) {
        requestAnimationFrame(main);
        return;
    }
    if(!useMaze2)
    {
        if(maze.length && !line) {
            line = maze.pop();
        }
        if(line && line.length) {
            cell = line.pop();
            if(cell) ctx.fillRect(line.length * colSize, maze.length * rowSize, colSize, rowSize); 
        }
        else line = null;
    } else {
       buildIsles2(density, shape, complexity);
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       for (let i = 0; i < maze.length; i++) {
           const line = maze[i];
           for (let k = 0; k < line.length; k++) {
               const cell = line[k];
               if(cell) ctx.fillRect(i * colSize, k * rowSize, colSize, rowSize); 
           }
       }
    }
    requestAnimationFrame(main);
}

// var maze = Maze();

function Maze(size=47, width=47, height=47, complexity=.20, density=.20, seedNumber) {// complexity=.75, density=.75) {
    seed = seedNumber ? seedNumber : Math.random();
    seeded = new Math.seedrandom(seed);
    // Only odd shapes
    this.shape  = [parseInt(size / 2) * 2 + 1, parseInt(size / 2) * 2 + 1];
    // Adjust complexity and density relative to maze size
    this.complexity = parseInt(complexity * (5 * (shape[0] + shape[1]))); // number of components
    this.density    = parseInt(density * (parseInt(shape[0] / 2) * parseInt(shape[1] / 2))); // size of components

    // Build actual maze
    Z = matrix(shape)

    // Make aisles
    if(!useMaze2) buildIsles(this.density, this.shape, this.complexity, size, width, height);

    return Z;
}

function buildIsles(density, shape, complexity, size, width, height) {
    for (let i of new Array(density)) {
        var x = rand(1, parseInt(shape[1] / 2)) * 2, y = rand(1, parseInt(shape[0] / 2)) * 2; // pick a random position
        Z[y][x] = !!1;
        for (let j of new Array(complexity)) {
            neighbours = [];
            if (x > 1)
                neighbours.push(new Array(y, x - 2));
            if (x < shape[1] - 2)
                neighbours.push(new Array(y, x + 2));
            if (y > 1)
                neighbours.push(new Array(y - 2, x));
            if (y < shape[0] - 2)
                neighbours.push(new Array(y + 2, x));
            if (neighbours.length) {
                var index = rand(0, neighbours.length)
                var ng = neighbours[index];
                y_ = ng[0], x_ = ng[1];
                // if (Z[y_][x_] == !!0) {
                    if (!Z[y_][x_]) {                    
                        Z[y_][x_] = true;
                        Z[y_ + parseInt((y - y_) / 2)][x_ + parseInt((x - x_) / 2)] = true;
                    if(useMaze2) {                    
                        ctx.fillRect(x_ * 2, y_ * 2, 2, 2);
                        ctx.fillRect((x_ + parseInt((x - x_) / 2)) * 2, (y_ + parseInt((y - y_) / 2)) * 2, 2, 2)
                    }
                    x = x_;
                    y = y_;
                }
            }
        }
    }

    createRoom(Z, parseInt(size / 2) - parseInt(roomSize / 2) , parseInt(size / 2) - parseInt(roomSize / 2) , roomSize, roomSize);
}

function matrix(shape) {
    var Z = new Array(shape[0]);
    for (var i = 0; i < Z.length; i++) {
        Z[i] = new Array(shape[1]);
        // Fill borders
        for (let k = 0; k < Z[i].length; k++) Z[i][k] = !k || !i || i == Z.length - 1 || k == Z[i].length - 1 ? true : false;
    }
    return Z;
}

function rand(min, max) {
    lastRnd = seeded();
    result = parseInt(lastRnd * (max - min) + min);
    return result <= max ? result : 0;;
}

function createRoom(Z = [], startx = 3, starty = 3, width = 3, height = 3){
    for (let i = 0; i < Z.length; i++) {
        const row = Z[i];
        for (let k = 0; k < row.length; k++) {
            if (i >= starty && i < starty + height &&
                k >= startx && k < startx + width) row[k] = false;
        }
    }
}


function buildIsles2(density, shape, complexity, width=47, height=47){
    if (iDensity < density && !iComplexity) {
        x = rand(1, parseInt(shape[1] / 2)) * 2, y = rand(1, parseInt(shape[0] / 2)) * 2; // pick a random position
        Z[y][x] = !!1;
        iDensity++;
    } else if (iDensity == density) createRoom(Z, parseInt(width / 2) - parseInt(roomSize / 2) , parseInt(height / 2) - parseInt(roomSize / 2) , roomSize, roomSize);
    while (iDensity < density) {
        if(iComplexity < complexity){
            iComplexity ++
            neighbours = [];
            var result = [];
            if (x > 1)
                neighbours.push(new Array(y, x - 2));
            if (x < shape[1] - 2)
                neighbours.push(new Array(y, x + 2));
            if (y > 1)
                neighbours.push(new Array(y - 2, x));
            if (y < shape[0] - 2)
                neighbours.push(new Array(y + 2, x));
            if (neighbours.length) {
                var idx = rand(0, neighbours.length)
                while(idx >= neighbours.length) idx = rand(0, neighbours.length)
                var ng = neighbours[idx];
                y_ = ng[0], x_ = ng[1];
                // if (Z[y_][x_] == !!0) {
                if (!Z[y_][x_]) {                    
                    Z[y_][x_] = true;
                    Z[y_ + parseInt((y - y_) / 2)][x_ + parseInt((x - x_) / 2)] = true;
                    result = [[y_,x_], [y_ + parseInt((y - y_) / 2),x_ + parseInt((x - x_) / 2)]];
                    x = x_;
                    y = y_;
                    break;
                }
            }        
        } else {            
            iComplexity = 0
            break;
        }
    }

    return result;
}

// main();

// setTimeout(main,3000)
