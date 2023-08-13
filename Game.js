class Game {
  constructor() {
    this.display = new Display("canvasId");
    this.players = new Map();
    this.my_id;

    this.setupUIEvents();
  }

  createNewPlayer(id) {
    this.players.set(
      id,
      new CanvasPlayer(
        this.display,
        (this.display.canvas.width / 100) * 50,
        (this.display.canvas.height / 100) * 50,
        10
      )
    );
    return this.players.get(id);
  }

  setupUIEvents() {
    document.getElementById("share").addEventListener("click", () => {
      const url = window.location.href + "?invitation=" + this.my_id;
      prompt(
        "Compartilhe este link para convidar alguém para se conectar a você:",
        url
      );
    });
  }

  update(direction) {
    if (!direction || !this.my_id) return;
    this.players.get(this.my_id).move(direction);
  }

  draw() {
    this.display.clear();

    this.players.forEach((player) => player.draw());
  }
}
