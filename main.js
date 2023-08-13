const urlParams = new URLSearchParams(window.location.search);
const another_id = urlParams.get("invitation");
const peerIdelement = document.getElementById("peerId");

const peer = new Peer(); // ID gerado automaticamente

const game = new Game();

peer.on("open", (id) => {
  peerIdelement.innerText = id;
  game.createNewPlayer(id);
  game.draw();
  game.my_id = id;
  if (another_id) {
    const conn = peer.connect(another_id);
    conn.on("open", () => {
      game.createNewPlayer(another_id);
      game.draw();
      document.addEventListener("keydown", (e) => {
        let direction;
        switch (e.key) {
          case "ArrowUp":
            direction = [0, -1];
            break;
          case "ArrowDown":
            direction = [0, 1];
            break;
          case "ArrowLeft":
            direction = [-1, 0];
            break;
          case "ArrowRight":
            direction = [1, 0];
            break;
        }
        game.update(direction);
        game.draw();
        conn.send({
          type: "playerMove",
          content: {
            id,
            direction,
          },
        });
      });
      conn.send({
        type: "playerJoin",
        content: {
          id,
        },
      });
    });
    conn.on("data", (data) => {
      if (data.type === "playerJoin") {
        game.createNewPlayer(data.content.id);
        game.draw();
        console.log(`PlayerJoined:`, data);
      } else if (data.type === "connectedPeers") {
        data.peers.forEach((id) => {
          game.createNewPlayer(id);
          game.draw();
        });
        console.log(`Peers conectados: ${data.peers}`);
      } else if (data.type === "playerMove") {
        console.log(data);
        game.players.get(data.content.id).move(data.content.direction);
        game.draw();
      }
    });
  } else {
    let connectedPeers = [];
    function broadcastData(data, blocked = []) {
      connectedPeers.forEach((conn) => {
        if (blocked.includes(conn.peer)) return;
        console.log("enviado a", conn.peer);
        conn.send(data);
      });
    }
    document.addEventListener("keydown", (e) => {
      let direction;
      switch (e.key) {
        case "ArrowUp":
          direction = [0, -1];
          break;
        case "ArrowDown":
          direction = [0, 1];
          break;
        case "ArrowLeft":
          direction = [-1, 0];
          break;
        case "ArrowRight":
          direction = [1, 0];
          break;
      }
      if (!direction) return;
      game.update(direction);
      game.draw();
      broadcastData({
        event: "playerMove",
        content: {
          id,
          direction,
        },
      });
    });
    peer.on("connection", (conn) => {
      console.log(`Peer ${conn.peer} conectado ao SuperPeer.`);
      connectedPeers.push(conn);
      conn.on("open", () => {
        conn.send({
          type: "connectedPeers",
          peers: connectedPeers.map((connection) => connection.peer),
        });
      });
      conn.on("data", (data) => {
        if (data.type === "playerJoin") {
          game.createNewPlayer(data.content.id);
          game.draw();
          broadcastData(data, [data.content.id]);
        }
        if (data.type === "playerMove") {
          game.players.get(data.content.id).move(data.content.direction);
          game.draw();
          broadcastData(data, [data.content.id]);
        }
      });
    });
  }
});
