class Display {
  constructor(elementId) {
    this.canvas = document.getElementById(elementId);
    this.context = this.canvas.getContext("2d");
  }

  drawBall(x, y, radius) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fillStyle = "#0095DD";
    this.context.fill();
    this.context.closePath();
  }

  drawLine(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.closePath();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class CanvasPlayer {
  constructor(display, x, y, radius) {
    this.display = display;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    this.display.drawBall(this.x, this.y, this.radius);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  move(vector) {
    let [vx, vy] = vector;
    this.x += vx;
    this.y += vy;
  }
}
