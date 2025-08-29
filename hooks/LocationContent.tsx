import React, { createContext, useContext, useState } from "react";
 type LocationData = { latitude: number; 
    longitude: number; 
    altitude?: number | null; 
    accuracy?: number | null; }; 
    type LocationContextType = { location: LocationData | null;
         setLocation: (loc: LocationData) => void; }; 
         const LocationContext = createContext<LocationContextType>({ location: null, setLocation: () => {}, }); 
         export const useLocation = () => useContext(LocationContext); 
         export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => 
            { const [location, setLocation] = useState<LocationData | null>(null); return ( <LocationContext.Provider value={{ location, setLocation }}> 
            {children} </LocationContext.Provider> ); };