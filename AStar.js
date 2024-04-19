let grid = document.getElementById('grid'); 

let addBlocked = false; 
let startSet = false; 
let endSet = false; 

let startPlaced = false; 
let endPlaced = false; 

document.getElementById('createMap').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
        grid.style.setProperty('--num', num); 

        grid.innerHTML = '';
        for (let index = 0; index < num * num; index++)
        { 
            let cell = document.createElement('div'); 
            cell.classList.add('cell'); 
            grid.appendChild(cell); 

            cell.addEventListener('click', function()
            { 
                if (addBlocked)
                { 
                    this.classList.add('blocked'); 
                }
                
                else if (startSet)
                { 
                    this.classList.add('start'); 
                    startPlaced = true; 
                    startSet = false; 
                }
                
                else if (endSet)
                { 
                    this.classList.add('end'); 
                    endPlaced = true; 
                    endSet = false; 
                } 

                else
                {
                    if (this.classList.contains('blocked'))
                    {
                        cell.classList.remove('blocked');
                    }
                    
                    else if (this.classList.contains('start'))
                    {
                        cell.classList.remove('start');
                        startPlaced = false; 
                    }
                    
                    else if (this.classList.contains('end'))
                    {
                        cell.classList.remove('end');
                        endPlaced = false;s 
                    }

                    else if (this.classList.contains('path'))
                    {
                        cell.classList.remove('path');
                    }

                }
            }); 
        }

    }
    
    else
    {
        alert('Введите положительное целое число для размера карты');
    }
});

document.getElementById('addBlocked').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    addBlocked = true;
    startSet = false;
    endSet = false;
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('setStart').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    addBlocked = false;
    if (!startPlaced)
    {
        startSet = true;
        endSet = false;
    }
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('setEnd').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    addBlocked = false;
    if (!endPlaced) 
    {
        endSet = true;
        startSet = false;
    }
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('deleteCell').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    addBlocked = false;
    startSet = false;
    endSet = false;
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('generateMap').addEventListener('click', function()
{ 
    let num = document.getElementById('mapSize').value; 
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
        let cells = grid.querySelectorAll('.cell');
        cells.forEach(cell =>
            {
            cell.classList.remove('blocked', 'start', 'end', 'path', 'visited');
        });
    let blockedCount = Math.floor(Math.random() * (num * num));    
    for (let index = 0; index < blockedCount; index++)
    { 
        let randomIndex = Math.floor(Math.random() * (num * num)); 
        grid.children[randomIndex].classList.add('blocked'); 
    } 
     
    let randomStart = Math.floor(Math.random() * (num * num)); 
    while(grid.children[randomStart].classList.contains('blocked'))
    {
        randomStart = Math.floor(Math.random() * (num * num));
    }
    grid.children[randomStart].classList.add('start'); 

    let randomEnd = Math.floor(Math.random() * (num * num)); 
    while(grid.children[randomEnd].classList.contains('blocked') || randomEnd === randomStart)
    {
        randomEnd = Math.floor(Math.random() * (num * num));
    }
    grid.children[randomEnd].classList.add('end'); 
     
    startPlaced = true; 
    endPlaced = true; 
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('clearMap').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    let cells = grid.querySelectorAll('.cell');
    cells.forEach(cell =>
        {
        cell.classList.remove('blocked', 'start', 'end', 'path', 'visited');
    });
    
    startPlaced = false;
    endPlaced = false;
}

else
{
    alert('Создайте карту');
}
});

document.getElementById('runAStar').addEventListener('click', function()
{
    let num = document.getElementById('mapSize').value; 
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
    findPath(distance);
}

else
{
    alert('Создайте карту');
}
});

function findPath(heuristic) 
{ 
    let startCell = document.querySelector('.start'); 
    let endCell = document.querySelector('.end'); 

    if (!startCell || !endCell) 
    { 
        alert('Необходимо установить начало и конец'); 
        return; 
    } 

    let gridCells = document.querySelectorAll('.cell'); 
    let openSet = [startCell]; 
    let cameFrom = new Map(); 
    let gScore = new Map(); 
    let fScore = new Map(); 

    for (let cell of gridCells) 
    { 
        gScore.set(cell, Infinity); 
        fScore.set(cell, Infinity); 
    } 

    gScore.set(startCell, 0); 
    fScore.set(startCell, heuristic(startCell, endCell)); 

    let interval = setInterval(() =>
    {
        if (openSet.length > 0) 
        {
            let current = openSet.reduce((minCell, cell) => fScore.get(cell) < fScore.get(minCell) ? cell : minCell); 

            if (current === endCell) 
            {  
                reconstructPath(cameFrom, current); 
                clearInterval(interval);
                alert('Путь найден'); 
                return;
            } 

            openSet = openSet.filter(cell => cell !== current); 

            let neighbors = getNeighbors(current); 

            for (let neighbor of neighbors) 
            { 
                let tentativeGScore = gScore.get(current) + 1; 

                if (tentativeGScore < gScore.get(neighbor)) 
                { 
                    cameFrom.set(neighbor, current); 
                    gScore.set(neighbor, tentativeGScore); 
                    fScore.set(neighbor, tentativeGScore + heuristic(neighbor, endCell)); 

                    if (!openSet.includes(neighbor)) 
                    { 
                        openSet.push(neighbor); 
                        neighbor.classList.add('visited');
                    }
                } 
            } 
        }
        
        else
        {
            clearInterval(interval);
            alert('Нет пути');
        }   
    }, 10);
} 

function getNeighbors(cell) 
{ 
    let neighbors = []; 
    let gridCells = document.querySelectorAll('.cell'); 
    let num = Math.sqrt(gridCells.length); 

    let cellIndex = Array.from(gridCells).indexOf(cell); 
    let row = Math.floor(cellIndex / num); 
    let col = cellIndex % num; 

    if (row > 0) neighbors.push(gridCells[cellIndex - num]); 
    if (row < num - 1) neighbors.push(gridCells[cellIndex + num]); 
    if (col > 0) neighbors.push(gridCells[cellIndex - 1]); 
    if (col < num - 1) neighbors.push(gridCells[cellIndex + 1]); 

    return neighbors.filter(neighbor => !neighbor.classList.contains('blocked')); 
} 

function reconstructPath(cameFrom, current) 
{ 
    while (cameFrom.has(current)) 
    { 
        current.classList.remove('visited'); 
        current.classList.add('path'); 
        current = cameFrom.get(current); 
    }
} 

function distance(cellA, cellB) 
{ 
    let gridCells = document.querySelectorAll('.cell'); 
    let num = Math.sqrt(gridCells.length); 

    let indexA = Array.from(gridCells).indexOf(cellA); 
    let rowA = Math.floor(indexA / num); 
    let colA = indexA % num; 

    let indexB = Array.from(gridCells).indexOf(cellB); 
    let rowB = Math.floor(indexB / num); 
    let colB = indexB % num; 

    return Math.abs(rowA - rowB) + Math.abs(colA - colB); 
}
