import { createContext, useState, useCallback } from "react";

export const MetricsContext = createContext();

export const MetricsProvider = ({ children }) => {
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);

  const updateMetrics = useCallback((metrics) => {
    setCurrentMetrics(metrics);
    setLastUpdated(new Date());
  }, []);

  const startMonitoring = useCallback((config) => {
    setServerConfig(config);
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  return (
    <MetricsContext.Provider
      value={{
        currentMetrics,
        lastUpdated,
        isMonitoring,
        serverConfig,
        updateMetrics,
        startMonitoring,
        stopMonitoring,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};