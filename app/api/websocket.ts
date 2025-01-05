const DEFAULT_PORT = 1547;
let toon: any = null;
let socket: WebSocket | null = null;
let scout: WebSocket | null = null;
let userId: string | null = "";
let contReqInterval: NodeJS.Timeout | null = null;
let scoutAttempts = 0;
const MAX_SCOUT_ATTEMPTS = 10;
const RECONNECT_DELAY = 10000;
const RECONNECT_INTERVAL = 5000;
const SCOUT_LINK =
  process.env.NEXT_PUBLIC_API_WSS || "wss://api.scouttoon.info";

export const initWebSocket = (
  setIsConnected: (isConnected: boolean) => void,
  setToonData: (data: any) => void,
  id: string
) => {
  userId = id;

  const connectWebSocket = () => {
    socket = new WebSocket(`ws://localhost:${DEFAULT_PORT}`);

    socket.addEventListener("open", (event) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket opened");
        socket.send(
          JSON.stringify({ authorization: initAuthToken(), name: "ToonScout" })
        );
        socket.send(JSON.stringify({ request: "all" }));
        startContinuousRequests();
      }
    });

    socket.addEventListener("message", (event) => {
      toon = JSON.parse(event.data);
      if (toon.event == "all") {
        setToonData(toon.data);
        setIsConnected(true);
      }
      startContinuousRequests();
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket closed:", event);
      setIsConnected(false);
      stopContinuousRequests();
      setTimeout(connectWebSocket, RECONNECT_DELAY);
    });
  };

  function startContinuousRequests() {
    if (contReqInterval) {
      clearInterval(contReqInterval);
    }

    contReqInterval = setInterval(async () => {
      if (userId && socket && socket.readyState === WebSocket.OPEN && toon) {
        try {
          await sendData(userId, toon);
          socket.send(JSON.stringify({ request: "all" }));
          setIsConnected(true);
        } catch (error) {
          console.error("Error in continuous request:", error);
        }
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

function connectScoutWebSocket() {
  scout = new WebSocket(SCOUT_LINK);

  scout.onopen = () => {
    console.log("Scout WebSocket connection established");
    scoutAttempts = 0;
  };

  scout.onerror = (error) => {
    console.error("Scout WebSocket error:", error);
  };

  scout.onclose = (event) => {
    console.log("Scout WebSocket connection closed:", event);
    handleScoutReconnection();
  };
}

function handleScoutReconnection() {
  if (scoutAttempts < MAX_SCOUT_ATTEMPTS) {
    scoutAttempts++;
    console.log(
      `Attempting to reconnect to scout WebSocket in ${RECONNECT_DELAY} ms...`
    );

    setTimeout(() => {
      connectScoutWebSocket();
    }, RECONNECT_DELAY);
  } else {
    console.log(
      "Max reconnection attempts for scout WebSocket reached. Stopping attempts."
    );
  }
}

async function sendData(userId: string, data: any) {
  if (scout && scout.readyState === WebSocket.OPEN) {
    scout.send(JSON.stringify({ userId, data }));
  } else {
    console.error("WebSocket connection is not open.");
    handleScoutReconnection();
  }
}

export default initWebSocket;

function initAuthToken() {
  const length = 16;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}
