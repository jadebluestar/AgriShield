// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Helper function to safely stringify data with BigInt values
const safeStringify = (data) => {
  return JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

// Helper function to safely parse data and convert string numbers back to BigInt if needed
const safeParse = (jsonString) => {
  return JSON.parse(jsonString, (key, value) => {
    // Convert back to BigInt for balance fields if the value looks like a large number
    if ((key === 'carbonBalance' || key === 'nftBalance') && 
        typeof value === 'string' && 
        /^\d+$/.test(value) && 
        value.length > 15) {
      return BigInt(value);
    }
    return value;
  });
};

export const AppProvider = ({ children }) => {
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedFarmerData = localStorage.getItem('farmerData');
    if (savedFarmerData) {
      try {
        setFarmerData(safeParse(savedFarmerData));
      } catch (err) {
        console.error('Error parsing farmerData:', err);
        localStorage.removeItem('farmerData');
      }
    }
  }, []);

  const updateFarmerData = (newData) => {
    setFarmerData(newData);
    localStorage.setItem('farmerData', safeStringify(newData));
  };

  const clearFarmerData = () => {
    setFarmerData(null);
    localStorage.removeItem('farmerData');
  };

  const updateCarbonBalance = (newBalance) => {
    if (farmerData) {
      const updated = { ...farmerData, carbonBalance: newBalance };
      setFarmerData(updated);
      localStorage.setItem('farmerData', safeStringify(updated));
    }
  };

  const updateNftBalance = (newBalance) => {
    if (farmerData) {
      const updated = { ...farmerData, nftBalance: newBalance };
      setFarmerData(updated);
      localStorage.setItem('farmerData', safeStringify(updated));
    }
  };

  // Add missing functions that Dashboard component needs
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const currentNotifications = farmerData?.notifications || [];
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    // Update farmer data with new notifications
    if (farmerData) {
      const updated = { ...farmerData, notifications: updatedNotifications };
      setFarmerData(updated);
      localStorage.setItem('farmerData', safeStringify(updated));
    }
  };

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: activity.id || Date.now(),
      date: activity.date || new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
    
    const currentActivities = farmerData?.activities || [];
    const updatedActivities = [newActivity, ...currentActivities];
    
    // Update farmer data with new activities
    if (farmerData) {
      const updated = { ...farmerData, activities: updatedActivities };
      setFarmerData(updated);
      localStorage.setItem('farmerData', safeStringify(updated));
    }
  };

  // For demonstration — provide some mock stats
  const stats = {
    creditScore: farmerData?.creditScore ?? 700,
    insurancePolicies: farmerData?.insurancePolicies ?? 0,
    activeLoans: farmerData?.activeLoans ?? 0,
    totalValue: farmerData?.totalValue ?? 0,
  };

  const value = {
    // User/Farmer data
    farmerData,
    updateFarmerData,
    clearFarmerData,
    updateCarbonBalance,
    updateNftBalance,
    
    // Stats
    stats,
    
    // Notifications and Activities (accessed from farmerData)
    notifications: farmerData?.notifications ?? [],
    activities: farmerData?.activities ?? [],
    addNotification,
    addActivity,
    
    // Registration status
    isRegistered: !!farmerData,
    
    // Loading and error states
    setLoading,
    loading,
    setError,
    error
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};