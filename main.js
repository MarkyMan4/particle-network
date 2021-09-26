const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.xVel = Math.random() * (Math.random() > 0.5 ? 1 : -1);
    this.yVel = Math.random() * (Math.random() > 0.5 ? 1 : -1);
  }
  
  // update position and decrease radius
  update() {
    this.x += this.xVel;
    this.y += this.yVel;
    
    if(this.radius >= 0.2)
      this.radius -= 0.01
  }
}

let mouseIsDown = false;
let particles = [];

const addParticles = (x, y) => {
  for(let i = 0; i < 3; i++) {
    particles.push(new Particle(x, y));
  }
}

const preventDefault = (e) => {
  e.preventDefault();
}

document.addEventListener('mousedown', (event) => {
  mouseIsDown = true;
  addParticles(event.x, event.y);
});

document.addEventListener('mouseup', (event) => {
  mouseIsDown = false;
});

document.addEventListener('mousemove', (event) => {
  if(mouseIsDown)
    addParticles(event.x, event.y);
});

document.addEventListener('touchstart', (event) => {
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
  mouseIsDown = true;
  addParticles(event.x, event.y);
});

document.addEventListener('touchend', (event) => {
  mouseIsDown = false;
});

document.addEventListener('touchmove', (event) => {
  document.body.addEventListener('touchmove', preventDefault, { passive: false });
  
  const x = event.targetTouches[0].screenX;
  const y = event.targetTouches[0].screenY;
  
  if(mouseIsDown)
    addParticles(x, y);
});

const drawAndUpdateParticles = () => {
  particles.forEach(particle => {
    // ctx.beginPath();
    // ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
    // ctx.fillStyle = 'black';
    // ctx.fill();
    // ctx.strokeStyle = 'white';
    // ctx.stroke();
    
    particle.update();
  });
}

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

const drawLines = () => {
  particles.forEach(p1 => {
    particles.forEach(p2 => {
      if(getDistance(p1.x, p1.y, p2.x, p2.y) <= 100) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = 'DodgerBlue';
        ctx.stroke();
      }
    });
  });
}

const isParticleOnScreen = (particle) => {
  if(particle.x + particle.radius <= 0
      || particle.x - particle.radius >= canvas.width
      || particle.y + particle.radius <= 0
      || particle.y - particle.radius >= canvas.height) {
        return false;
  }
  
  return true;
}

// remove particles once radius < 0.2 or if they go off the screen
const removeParticles = () => {
  for(let i = 0; i < particles.length; i++) {
    if(particles[i].radius < 0.2 || !isParticleOnScreen(particles[i]))
      particles.splice(i, 1);
  }
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawLines();
  drawAndUpdateParticles();
  removeParticles();
  
  requestAnimationFrame(animate);
}

animate();
