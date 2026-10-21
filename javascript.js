const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const ROAD_WIDTH = 400;

const player = {
    x: 0,
    speed: 0,
    health: 100
};

const keys = {};
let shake = 0;
let flash = 0;
let roadOffset = 0;

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

const enemies = [];

for (let i = 0; i < 12; i++) {
    enemies.push({
        x: (Math.random() - 0.5) * 320,
        z: 600 + i * 300,
        color: `hsl(${Math.random()*360},90%,60%)`
    });
}

function impact() {
    shake = 20;
    flash = 10;

    player.speed *= 0.6;
    player.health -= 10;

    if(player.health < 0){
        player.health = 0;
    }
}

function update() {

    const left =
        keys["arrowleft"] || keys["a"];

    const right =
        keys["arrowright"] || keys["d"];

    const accel =
        keys["arrowup"] || keys["w"];

    const brake =
        keys["arrowdown"] || keys["s"];

    if(left){
        player.x -= 7;
    }

    if(right){
        player.x += 7;
    }

    if(accel){
        player.speed += .2;
    }

    if(brake){
        player.speed -= .2;
    }

    player.speed *= .985;

    player.speed = Math.max(0, player.speed);
    player.speed = Math.min(25, player.speed);

    roadOffset += player.speed;

    player.x = Math.max(
        -ROAD_WIDTH/2 + 40,
        Math.min(
            ROAD_WIDTH/2 - 40,
            player.x
        )
    );

    enemies.forEach(enemy => {

        enemy.z -= player.speed * 6;

        if(enemy.z < 10){

            enemy.z = 3000;

            enemy.x =
                (Math.random()-0.5)*320;

            return;
        }

        if(
            enemy.z < 120 &&
            Math.abs(enemy.x-player.x)<50
        ){
            impact();
            enemy.z = 3000;
        }
    });

    if(shake > 0) shake--;
    if(flash > 0) flash--;
}

function drawBackground() {

    ctx.fillStyle = "#170022";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(let i=0;i<50;i++){

        ctx.fillStyle =
            "#2d0d44";

        const x =
            (i*150 + roadOffset*.2)
            % canvas.width;

        ctx.fillRect(
            x,
            120,
            80,
            250 + (i%5)*40
        );

        ctx.fillStyle="#ff00ff";

        for(let j=0;j<12;j++){

            ctx.fillRect(
                x+10+(j%3)*20,
                140+Math.floor(j/3)*40,
                10,
                15
            );
        }
    }
}

function drawRoad() {

    const center = canvas.width/2;

    ctx.fillStyle = "#183018";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for(let i=0;i<300;i++){

        let y =
            ((i*20)+(roadOffset*2))
            % canvas.height;

        ctx.fillStyle =
            i%2 ? "#224422" : "#2f5f2f";

        ctx.fillRect(
            0,
            y,
            canvas.width,
            20
        );
    }

    ctx.fillStyle="#222";

    ctx.beginPath();
    ctx.moveTo(center-100,120);
    ctx.lineTo(center+100,120);
    ctx.lineTo(center+300,canvas.height);
    ctx.lineTo(center-300,canvas.height);
    ctx.fill();

    ctx.strokeStyle="#ffff00";
    ctx.lineWidth=4;

    ctx.beginPath();
    ctx.moveTo(center-100,120);
    ctx.lineTo(center-300,canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center+100,120);
    ctx.lineTo(center+300,canvas.height);
    ctx.stroke();

    ctx.strokeStyle="white";

    for(let i=0;i<20;i++){

        let y =
            ((i*80)+roadOffset*4)
            % canvas.height;

        ctx.beginPath();
        ctx.moveTo(center,y);
        ctx.lineTo(center,y+35);
        ctx.stroke();
    }
}

function drawCar(x,y,w,h,color){

    ctx.fillStyle=color;

    ctx.fillRect(
        x-w/2,
        y-h,
        w,
        h
    );

    ctx.fillStyle="#000";

    ctx.fillRect(
        x-w/2+5,
        y-h+15,
        w-10,
        15
    );

    ctx.fillStyle="#00ffff";

    ctx.fillRect(
        x-w/2+10,
        y-h+20,
        w-20,
        8
    );

    ctx.fillStyle="#111";

    ctx.fillRect(
        x-w/2-4,
        y-h+8,
        8,
        18
    );

    ctx.fillRect(
        x+w/2-4,
        y-h+8,
        8,
        18
    );

    ctx.fillRect(
        x-w/2-4,
        y-22,
        8,
        18
    );

    ctx.fillRect(
        x+w/2-4,
        y-22,
        8,
        18
    );
}

function drawEnemies(){

    for(const enemy of enemies){

        let scale =
            Math.max(.1,800/enemy.z);

        let x =
            canvas.width/2 +
            (enemy.x-player.x)*scale;

        let y =
            120 +
            (800-enemy.z)*0.7;

        drawCar(
            x,
            y,
            40*scale,
            70*scale,
            enemy.color
        );
    }
}

function drawPlayer(){

    drawCar(
        canvas.width/2,
        canvas.height-100,
        60,
        100,
        "#00aaff"
    );
}

function drawUI(){

    ctx.fillStyle="#ff55ff";
    ctx.font="20px monospace";

    ctx.fillText(
        "Speed: " +
        Math.floor(player.speed*10),
        20,
        40
    );

    ctx.fillText(
        "Health: " +
        player.health,
        20,
        70
    );
}

function drawHitEffects(){

    if(shake>0){

        ctx.translate(
            (Math.random()-.5)*shake,
            (Math.random()-.5)*shake
        );
    }

    if(flash>0){

        ctx.fillStyle =
            `rgba(255,255,255,${
                flash/10
            })`;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

function draw(){

    ctx.save();

    drawHitEffects();

    drawBackground();
    drawRoad();
    drawEnemies();
    drawPlayer();
    drawUI();

    ctx.restore();
}

function gameLoop(){

    update();
    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();
