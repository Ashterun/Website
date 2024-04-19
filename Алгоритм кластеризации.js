let clusterVisualization = document.getElementById('clusterVisualization');
let points = [];
let clusters = [];

clusterVisualization.addEventListener('click', function(event)
{
    let rect = clusterVisualization.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let point = document.createElement('div');
    point.className = 'point';
    point.style.left = x + 'px';
    point.style.top = y + 'px';

    clusterVisualization.appendChild(point);

    points.push({ x, y });
});

function сlustering(num, points)
{

    let centroids = [];
    
    for (let i = 0; i < num; i++)
    {
        centroids.push({ x: Math.random() * 750, y: Math.random() * 750 });
    }
    
    let updatedCentroids = centroids.slice();
    let maxIterations = 100;
    let iteration = 0;
    
    while (iteration < maxIterations)
    {
        clusters = [];
    
        for (let i = 0; i < points.length; i++)
        {
            let minDistance = Infinity;
            let clusterIndex = 0;
    
            for (let j = 0; j < updatedCentroids.length; j++)
            {
                let distance = Math.sqrt(Math.pow(points[i].x - updatedCentroids[j].x, 2) + Math.pow(points[i].y - updatedCentroids[j].y, 2));
    
                if (distance < minDistance)
                {
                    minDistance = distance;
                    clusterIndex = j;
                }
            }
    
            if (!clusters[clusterIndex])
            {
                clusters[clusterIndex] = [];
            }
    
            clusters[clusterIndex].push(points[i]);
        }
    
        for (let i = 0; i < clusters.length; i++)
        {
            if (clusters[i] && clusters[i].length > 0)
            {
                let sumX = 0;
                let sumY = 0;
    
                for (let j = 0; j < clusters[i].length; j++)
                {
                    sumX += clusters[i][j].x;
                    sumY += clusters[i][j].y;
                }
    
                updatedCentroids[i] = { x: sumX / clusters[i].length, y: sumY / clusters[i].length };
            }
        }
    
        iteration++;
    }
    
    return clusters;
    }
    

document.getElementById('clearPoints').addEventListener('click', function(event)
{
    clusterVisualization.innerHTML = '';
    points.length = 0;
    clusters.length = 0;
});

document.getElementById('runClaster').addEventListener('click', function(event)
{
    let num = document.getElementById('clusterNum').value;
    if (num > 0 && Number.isInteger(parseFloat(num)))
    {
        clusters = сlustering(num, points);
        for (let i = 0; i < clusters.length; i++)
        {
            let color = '#' + ((Math.random() * 0xFFFFFF) << 0).toString(16);
            if (clusters[i])
            {
                for (let j = 0; j < clusters[i].length; j++)
                {
                    let point = document.createElement('div');
                    point.className = 'point';
                    point.style.left = clusters[i][j].x + 'px';
                    point.style.top = clusters[i][j].y + 'px';
                    point.style.backgroundColor = color;
                    clusterVisualization.appendChild(point);
                }
            }
        }
    }
    else
    {
        alert('Введите положительное целое число для количества кластеров')
    }
});