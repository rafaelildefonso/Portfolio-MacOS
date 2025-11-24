import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
interface ConnectionContextType {
  isOnline: boolean;
  toggleConnection: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isManuallyOffline, setIsManuallyOffline] = useState<boolean>(false);

  // Atualiza o status da conexão quando a conexão real mudar
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Alterna entre online/offline manualmente
  const toggleConnection = () => {
    if (isManuallyOffline) {
      // Se estiver offline manualmente, volta para o estado real da conexão
      setIsManuallyOffline(false);
      setIsOnline(navigator.onLine);
    } else {
      // Força o estado offline
      setIsManuallyOffline(true);
      setIsOnline(false);
    }
  };

  const value = {
    isOnline: isManuallyOffline ? false : isOnline,
    toggleConnection,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
