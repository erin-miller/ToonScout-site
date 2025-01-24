const DEFAULT_PORTS = [1547, 1548, 1549, 1550, 1551, 1552];
const RECONNECT_DELAY = 10000;
const RECONNECT_INTERVAL = 5000;

let sockets: { [port: number]: WebSocket } = {};
let contReqInterval: NodeJS.Timeout | null = null;

export const initWebSocket = (
  setIsConnected: (isConnected: boolean) => void,
  addToon: (data: any) => void
) => {
  const connectWebSocket = () => {
    DEFAULT_PORTS.forEach((port) => {
      if (sockets[port] && sockets[port].readyState !== WebSocket.CLOSED) {
        return;
      }

      const socket = new WebSocket(`ws://localhost:${port}`);
      sockets[port] = socket;

      socket.addEventListener("open", () => {
        console.log(`WebSocket opened on port ${port}`);
        socket.send(
          JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" })
        );
        socket.send(JSON.stringify({ request: "all" }));
        startContinuousRequests();
      });

      socket.addEventListener("message", (event) => {
        const toon = JSON.parse(event.data);
        if (toon.event === "all") {
          const timestamp = Date.now();
          const localToon = { data: toon, timestamp };
          localStorage.setItem("toonData", JSON.stringify(localToon));
          addToon(toon);
        }
      });

      socket.addEventListener("error", (error) => {
        setIsConnected(false);
        cleanupWebSocket(port);
      });

      socket.addEventListener("close", () => {
        setIsConnected(false);
        stopContinuousRequests();
        cleanupWebSocket(port);
        setTimeout(() => connectWebSocket(), RECONNECT_DELAY);
      });
    });
  };

  function cleanupWebSocket(port: number) {
    const socket = sockets[port];
    if (socket) {
      socket.removeEventListener("open", () => {});
      socket.removeEventListener("message", () => {});
      socket.removeEventListener("error", () => {});
      socket.removeEventListener("close", () => {});
      delete sockets[port];
    }
  }

  function startContinuousRequests() {
    if (contReqInterval) clearInterval(contReqInterval);

    contReqInterval = setInterval(() => {
      // Send requests for each socket
      Object.values(sockets).forEach((socket) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ request: "all" }));
        }
      });
    }, RECONNECT_INTERVAL);
  }

  function stopContinuousRequests() {
    if (contReqInterval) {
      clearInterval(contReqInterval);
      contReqInterval = null;
    }
  }

  connectWebSocket();
};

function initAuthToken() {
  const length = 16;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length })
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join("");
}
