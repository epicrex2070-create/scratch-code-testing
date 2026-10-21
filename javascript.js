const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const player = {
    x: 0,
    speed: 0
};

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

let roadOffset = 0;

const enemies = [];

for (let i = 0; i < 10; i++) {
    enemies.push({
        x: (Math.random() * 2 - 1) * 200,
        z: 500 + i * 300
    });
}

function update() {
    if (keys["ArrowLeft"]) {
        player.x -= 6;
    }

    if (keys["ArrowRight"]) {
        player.x += 6;
    }

    if (keys["ArrowUp"]) {
        player.speed += 0.15;
    }

    if (keys["ArrowDown"]) {
        player.speed -= 0.15;
    }

    player.speed *= 0.98;

    if (player.speed < 0) player.speed = 0;
    if (player.speed > 20) player.speed = 20;

    roadOffset += player.speed;

    for (const enemy of enemies) {
        enemy.z -= player.speed * 5;

        if (enemy.z < 20) {
            enemy.z = 3000;
            enemy.x = (Math.random() * 2 - 1) * 200;
        }
    }
}

function drawRoad() {
    ctx.fillStyle = "#3a9d23";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const center = canvas.width / 2;
    const horizon = 120;

    ctx.fillStyle = "#444";

    ctx.beginPath();
    ctx.moveTo(center - 80, horizon);
    ctx.lineTo(center + 80, horizon);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 6;

    for (let i = 0; i < 20; i++) {
        const y = ((i * 80 + roadOffset) % 1600);
        const scale = y / 1600;

        const screenY =
            horizon + scale * (canvas.height - horizon);

        ctx.beginPath();
        ctx.moveTo(center, screenY);
        ctx.lineTo(center, screenY + 30);
        ctx.stroke();
    }
}

function drawEnemy(enemy) {
    const horizon = 120;

    const scale = 800 / enemy.z;

    if (scale <= 0) return;

    const x =
        canvas.width / 2 +
        (enemy.x - player.x) * scale;

    const 
