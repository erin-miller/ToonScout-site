const DEFAULT_PORT = 1547;
const RECONNECT_DELAY = 10000;
const RECONNECT_INTERVAL = 5000;

let socket: WebSocket | null = null;
let contReqInterval: NodeJS.Timeout | null = null;

export const initWebSocket = (
  setIsConnected: (isConnected: boolean) => void,
  setToonData: (data: any) => void
) => {
  const connectWebSocket = () => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);

    socket.addEventListener("open", () => {
      console.log("WebSocket opened");
      socket?.send(
        JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" })
      );
      socket?.send(JSON.stringify({ request: "all" }));
      startContinuousRequests(setIsConnected);
    });

    socket.addEventListener("message", (event) => {
      const toon = JSON.parse(event.data);
      if (toon.event === "all") {
        setToonData(toon.data);
        setIsConnected(true);
      }
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      cleanupWebSocket();
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket closed");
      setIsConnected(false);
      stopContinuousRequests();
      cleanupWebSocket();
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    });
  };

  function cleanupWebSocket() {
    if (socket) {
      socket.removeEventListener("open", () => {});
      socket.removeEventListener("message", () => {});
      socket.removeEventListener("error", () => {});
      socket.removeEventListener("close", () => {});
      socket = null;
    }
  }

  function startContinuousRequests(
    setIsConnected: (isConnected: boolean) => void
  ) {
    if (contReqInterval) clearInterval(contReqInterval);

    contReqInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ request: "all" }));
        setIsConnected(true);
      }
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
