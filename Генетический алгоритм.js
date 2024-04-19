let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let cities = [];
let population = [];

let bestSolution;
let bestDistance = Infinity;

let populationSize = 100;

canvas.width = 750;
canvas.height = 750;

canvas.addEventListener('click', (event) =>
{
    let { offsetX, offsetY } = event;
    cities.push({ x: offsetX, y: offsetY });
    drawCity(offsetX, offsetY);
});

function drawCity(x, y)
{
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawPath(solution)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let index = 0; index < cities.length; index++)
    {
        let city = cities[solution[index]];
        let nextCity = cities[solution[(index + 1) % cities.length]];
        
        ctx.beginPath();
        ctx.moveTo(city.x, city.y);
        ctx.lineTo(nextCity.x, nextCity.y);
        ctx.stroke();
    }
    
    cities.forEach(city => drawCity(city.x, city.y));
}

function generatePopulation()
{
    for (let index = 0; index < populationSize; index++)
    {
        population.push(shuffle([...Array(cities.length).keys()]));
    }
}

function shuffle(array)
{
    return array.sort(() => Math.random() - 0.5);
}

function calculateDistance(solution)
{
    let distance = 0;
    
    for (let index = 0; index < cities.length; index++)
    {
        let city = cities[solution[index]];
        let nextCity = cities[solution[(index + 1) % cities.length]];
       
        distance += Math.sqrt(Math.pow(nextCity.x - city.x, 2) + Math.pow(nextCity.y - city.y, 2));
    }
    
    return distance;
}

function crossover(parent1, parent2)
{
    let start = Math.floor(Math.random() * cities.length);
    let end = Math.floor(Math.random() * cities.length);
    
    if (end < start)
    {
        [start, end] = [end, start];
    }
    
    let child = parent1.slice(start, end);

    parent2.forEach(city =>
        {
            if (!child.includes(city))
            {
                child.push(city);
            }
        });
        
    return child;
}

function evolve()
{
    let newPopulation = [];
    
    for (let index = 0; index < populationSize; index++)
    {
        let parent1 = population[Math.floor(Math.random() * populationSize)];
        let parent2 = population[Math.floor(Math.random() * populationSize)];
        
        let child = crossover(parent1, parent2);
        newPopulation.push(child);
    }
    
    population = newPopulation;
}

function findBestSolution()
{
    population.forEach(solution =>
        {
            let distance = calculateDistance(solution);
            if (distance < bestDistance)
            {
                bestDistance = distance;
                bestSolution = solution;
            }
        });
        
        drawPath(bestSolution);
    }

document.getElementById('startBtn').addEventListener('click', () =>
{
    if (cities.length === 0)
    {
        alert('Добавьте хотя бы две точки');
        return;
    }
    
    generatePopulation();
    
    for (let index = 0; index < 10000; index++)
    {
        evolve();
        findBestSolution();
    }
});

document.getElementById('resetBtn').addEventListener('click', () =>
{
    cities.length = 0;
    population = [];
    bestSolution = undefined;
    bestDistance = Infinity;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});