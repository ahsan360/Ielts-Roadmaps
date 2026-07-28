"use client";

import { useEffect, useRef, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

export function useWebSocket(onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {}
    };

    ws.onclose = () => {
      // Reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    return ws;
  }, [onMessage]);

  useEffect(() => {
    const ws = connect();
    return () => ws.close();
  }, [connect]);
}
