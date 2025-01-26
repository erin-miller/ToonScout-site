import { StoredToonData, ToonData } from "../types";

const DEFAULT_PORTS = [1547, 1548, 1549, 1550, 1551, 1552, 1553, 1554];
const RECONNECT_DELAY = 10000;
const RECONNECT_INTERVAL = 5000;

let sockets: { [port: number]: WebSocket } = {};
let contReqInterval: NodeJS.Timeout | null = null;
let active: number[] = [];

export const initWebSocket = (
  setIsConnected: (isConnected: boolean) => void,
  addActivePort: (port: number) => void,
  removeActivePort: (port: number) => void,
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
        socket.send(
          JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" })
        );
        socket.send(JSON.stringify({ request: "all" }));
        startContinuousRequests();
      });

      socket.addEventListener("message", (event) => {
        addPort(port);
        updateConnectionStatus();

        const toon = JSON.parse(event.data);
        if (toon.event === "all") {
          const timestamp = Date.now();
          const localToon = { data: toon, timestamp, port };
          const data = localStorage.getItem("toonData");
          let curr = data ? JSON.parse(data) : [];
          if (!curr || curr.length <= 0) {
            curr = [localToon];
          } else {
            // check if this toon exists in the storage
            const toonIndex = curr.findIndex(
              (stored: StoredToonData) =>
                stored.data.data.toon.id == toon.data.toon.id
            );

            if (toonIndex !== -1) {
              // exists
              curr[toonIndex] = localToon;
            } else {
              // add new
              curr.push(localToon);

              if (curr.length > 8) {
                curr.shift();
              }
            }

            // remove same ports from other toons in the data
            const portIndex = curr.findIndex(
              (stored: StoredToonData) =>
                stored.port === port &&
                stored.data.data.toon.id != toon.data.toon.id
            );

            if (portIndex !== -1) {
              // there is another toon with the port
              delete curr[portIndex].port;
            }
          }
          localStorage.setItem("toonData", JSON.stringify(curr));
          addToon(toon);
        }
      });

      socket.addEventListener("error", (error) => {
        cleanupWebSocket(port);
      });

      socket.addEventListener("close", () => {
        updateConnectionStatus();
        cleanupWebSocket(port);
        if (active.length === 0) {
          stopContinuousRequests();
        }
        setTimeout(() => connectWebSocket(), RECONNECT_DELAY);
      });
    });
  };

  function cleanupWebSocket(port: number) {
    removePort(port);
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
    if (contReqInterval) return;

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

  function updateConnectionStatus() {
    setIsConnected(active.length > 0);
  }

  function addPort(port: number) {
    if (!active.includes(port)) {
      active.push(port);
    }
    addActivePort(port);
  }

  function removePort(port: number) {
    active = active.filter((p) => p !== port);
    removeActivePort(port);
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
