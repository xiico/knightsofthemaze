
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#000';
var cell;
var line;
var start = 0;
function main(Z){    
    if(maze.length && !line) {
        line = maze.pop();
    }
    if(line && line.length) {
        cell = line.pop();
        if(cell) ctx.fillRect(line.length * 2, maze.length * 2, 2, 2); 
    }
    else line = null;
    // ctx.fillRect(5,5,5,5);
    requestAnimationFrame(main)
}
var maze = maze();

function maze(width=31, height=31, complexity=.75, density=.75) { //
    // Only odd shapes
    var shape  = [parseInt(height / 2) * 2 + 1, parseInt(width / 2) * 2 + 1];
    // Adjust complexity and density relative to maze size
    complexity = parseInt(complexity * (5 * (shape[0] + shape[1]))); // number of components
    density    = parseInt(density * (parseInt(shape[0] / 2) * parseInt(shape[1] / 2))); // size of components

    // Build actual maze
    Z = matrix(shape)

    // Make aisles
    for(let i of new Array(density)){
        x = rand(1, parseInt(shape[1] / 2)) * 2, y = rand(1, parseInt(shape[0] / 2)) * 2; // pick a random position
        Z[y][x] = !!1
        for(let j of new Array(complexity)) {
            neighbours = []
            if (x > 1)            neighbours.push(new Array(y, x - 2));
            if (x < shape[1] - 2) neighbours.push(new Array(y, x + 2));
            if (y > 1)            neighbours.push(new Array(y - 2, x));
            if (y < shape[0] - 2) neighbours.push(new Array(y + 2, x));
            if (neighbours.length) {
                var ng = neighbours[rand(0, neighbours.length - 1)];
                y_ = ng[0], x_ = ng[1];
                if (Z[y_][x_] == !!0) {
                    Z[y_][x_] = !!1
                    Z[y_ + parseInt((y - y_) / 2)][x_ + parseInt((x - x_) / 2)] = !!1
                    x = x_;
                    y = y_;
                }
            }
        }
    }

    return Z;
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
    return parseInt(Math.random() * (max - min) + min);
}
main();
