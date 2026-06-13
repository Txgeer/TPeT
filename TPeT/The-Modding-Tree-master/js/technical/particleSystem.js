// particleSystem.js - Vue 3 响应式版本
const particles = Vue.reactive({});
let particleID = 0;

let mouseX = 0;
let mouseY = 0;

/**
 * 生成一组粒子
 * @param {Object} data 粒子配置（可包含函数属性）
 * @param {number} amount 生成数量
 * @param {string} type 粒子类型 ('normal' 或 'shiny')
 */
function makeParticles(data, amount = 1, type = "normal") {
    for (let x = 0; x < amount; x++) {
        let particle = newParticles[type]();
        for (let thing in data) {
            switch (thing) {
                case 'onClick':
                case 'onMouseEnter':
                case 'onMouseLeave':
                case 'update':
                    particle[thing] = data[thing];
                    break;
                default:
                    particle[thing] = run(data[thing], data, x);
            }
        }
        if (data.dir === undefined) {
            particle.dir = particle.angle;
        }
        particle.dir = particle.dir + (particle.spread * (x - amount / 2 + 0.5));

        if (particle.offset) {
            particle.x += particle.offset * sin(particle.dir);
            particle.y += particle.offset * cos(particle.dir) * -1;
        }

        particle.xVel = particle.speed * sin(particle.dir);
        particle.yVel = particle.speed * cos(particle.dir) * -1;
        particle.fadeInTimer = particle.fadeInTime;

        // Vue 3: 直接为响应式对象添加新属性即可触发更新
        particles[particle.id] = particle;
    }
}

/**
 * 生成静止闪光粒子（随机位置）
 */
function makeShinies(data, amount = 1) {
    makeParticles(data, amount, "shiny");
}

/**
 * 更新所有粒子（每帧调用）
 * @param {number} diff 时间差（秒）
 */
function updateParticles(diff) {
    for (let p in particles) {
        let particle = particles[p];
        particle.time -= diff;
        particle.fadeInTimer -= diff;
        if (particle.time < 0) {
            // Vue 3: 直接删除属性
            delete particles[p];
        } else {
            if (particle.update) run(particle.update, particle);
            particle.angle += particle.rotation;
            particle.x += particle.xVel;
            particle.y += particle.yVel;
            particle.speed = Math.sqrt(particle.xVel * particle.xVel + particle.yVel * particle.yVel);
            particle.dir = atan(-particle.xVel / particle.yVel);
            particle.yVel += particle.gravity;
        }
    }
}

/**
 * 设置粒子的飞行方向（角度制）
 */
function setDir(particle, dir) {
    particle.dir = dir;
    particle.xVel = particle.speed * sin(particle.dir);
    particle.yVel = particle.speed * cos(particle.dir) * -1;
}

/**
 * 设置粒子的飞行速度
 */
function setSpeed(particle, speed) {
    particle.speed = speed;
    particle.xVel = particle.speed * sin(particle.dir);
    particle.yVel = particle.speed * cos(particle.dir) * -1;
}

// 粒子模板工厂
const newParticles = {
    normal() {
        particleID++;
        return {
            time: 3,
            id: particleID,
            x: mouseX,
            y: mouseY,
            width: 35,
            height: 35,
            image: "resources/genericParticle.png",
            angle: 0,
            spread: 30,
            offset: 10,
            speed: 15,
            xVel: 0,
            yVel: 0,
            rotation: 0,
            gravity: 0,
            fadeOutTime: 1,
            fadeInTimer: 0,
            fadeInTime: 0,
        };
    },
    shiny() {
        particleID++;
        return {
            time: 10,
            id: particleID,
            x: Math.random() * (tmp.other.screenWidth - 100) + 50,
            y: Math.random() * (tmp.other.screenHeight - 100) + 50,
            width: 50,
            height: 50,
            image: "resources/genericParticle.png",
            angle: 0,
            spread: 0,
            offset: 0,
            speed: 0,
            xVel: 0,
            yVel: 0,
            rotation: 0,
            gravity: 0,
            fadeOutTime: 1,
            fadeInTimer: 0,
            fadeInTime: 0.5,
        };
    },
};

/**
 * 更新鼠标坐标（用于粒子生成位置）
 */
function updateMouse(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

/**
 * 计算粒子当前透明度
 */
function getOpacity(particle) {
    if (particle.time < particle.fadeOutTime && particle.fadeOutTime) {
        return particle.time / particle.fadeOutTime;
    }
    if (particle.fadeInTimer > 0) {
        return 1 - particle.fadeInTimer / particle.fadeInTime;
    }
    return 1;
}

/**
 * 构造粒子的样式对象（用于 v-bind:style）
 */
function constructParticleStyle(particle) {
    let style = {
        left: (particle.x - particle.height / 2) + 'px',
        top: (particle.y - particle.height / 2) + 'px',
        width: particle.width + 'px',
        height: particle.height + 'px',
        transform: "rotate(" + particle.angle + "deg)",
        opacity: getOpacity(particle),
        "pointer-events": (particle.onClick || particle.onHover) ? 'auto' : 'none',
    };
    if (particle.color) {
        style["background-color"] = particle.color;
        style.mask = "url(#pmask" + particle.id + ")";
        style["-webkit-mask-box-image"] = "url(" + particle.image + ")";
    } else {
        style["background-image"] = "url(" + particle.image + ")";
    }
    return style;
}

/**
 * 清除符合条件的粒子
 * @param {Function|boolean} check 函数或 true（清除全部）
 */
function clearParticles(check = true) {
    for (let p in particles) {
        if (run(check, particles[p], particles[p])) {
            delete particles[p];
        }
    }
}

function sin(x) { return Math.sin(x * Math.PI / 180); }
function cos(x) { return Math.cos(x * Math.PI / 180); }
function tan(x) { return Math.tan(x * Math.PI / 180); }
function asin(x) { return Math.asin(x) * 180 / Math.PI; }
function acos(x) { return Math.acos(x) * 180 / Math.PI; }
function atan(x) { return Math.atan(x) * 180 / Math.PI; }