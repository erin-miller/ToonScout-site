import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import Toast from "@/app/components/Toast";

interface ToastContextType {
  triggerToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  triggerToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const triggerToast = useCallback((msg: string) => {
    setMessage(msg);
    setShow(true);
    // Optionally play sound here if needed
    const audio = new Audio("/sounds/notify.mp3");
    audio.play();
  }, []);

  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      <Toast message={message} show={show} onClose={() => setShow(false)} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
