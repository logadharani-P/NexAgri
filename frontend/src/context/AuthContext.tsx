import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface UserProfile {
  name: string;
  phone: string;
  role: UserRole;
  state: string;
  district: string;
  village?: string;
  taluk?: string;
  pincode?: string;
  cropsGrown?: string[];
  landAcres?: number;
  landOwnership?: string;
  soilType?: string;
  irrigation?: string;
  aadhaarOrKcc?: string;
  upiId?: string;
  bankAccount?: string;
  preferredMandi?: string;
  fpoName?: string;
  kisanId?: string;
  businessName?: string;
  buyerRating?: number;
  reliabilityScore?: number;
  verified: boolean;
  registeredAt?: string;
}

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  loginWithOtp: (phone: string, role: UserRole) => Promise<boolean>;
  loginWithKisanId: (kisanId: string, pin: string) => Promise<boolean>;
  loginWithCredentials: (identifier: string, password: string, roleHint?: UserRole) => Promise<boolean>;
  registerFarmer: (data: Partial<UserProfile>) => Promise<boolean>;
  registerUser: (name: string, mobile: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  quickDemoLogin: (role?: UserRole) => void;
  logout: () => void;
  registeredFarmers: UserProfile[];
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  farmer: {
    name: "R. Selvam (விவசாயி)",
    phone: "+91 98421 78901",
    role: "farmer",
    state: "Tamil Nadu",
    district: "Coimbatore",
    village: "Sirumugai, Mettupalayam",
    taluk: "Mettupalayam",
    pincode: "641302",
    kisanId: "TN-CBE-2026-8941",
    aadhaarOrKcc: "XXXX-XXXX-4821",
    landAcres: 4.5,
    landOwnership: "Owner",
    soilType: "Red Loamy",
    irrigation: "Drip Irrigation",
    cropsGrown: ["Tomato", "Carrot", "Turmeric"],
    upiId: "selvam.farmer@sbi",
    preferredMandi: "Mettupalayam",
    fpoName: "Sirumugai Farmer Producer Co.",
    verified: true,
    registeredAt: "2024-03-15"
  },
  buyer: {
    name: "R. Selvaraj",
    businessName: "Kaveri Agro Foods Pvt Ltd",
    phone: "+91 98421 99000",
    role: "buyer",
    state: "Tamil Nadu",
    district: "Coimbatore",
    buyerRating: 4.9,
    reliabilityScore: 98,
    verified: true
  },
  admin: {
    name: "Super Administrator",
    phone: "+91 99000 11222",
    role: "admin",
    state: "Tamil Nadu",
    district: "State Agri Portal HQ",
    verified: true
  },
  logistics: {
    name: "M. Kumar (Gramin Transporters)",
    phone: "+91 97890 12345",
    role: "logistics",
    state: "Tamil Nadu",
    district: "Coimbatore",
    verified: true
  },
  storage: {
    name: "Nilgiris Cold Storage Manager",
    phone: "+91 94432 54321",
    role: "storage",
    state: "Tamil Nadu",
    district: "Coimbatore",
    verified: true
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('nexagri_current_user') || localStorage.getItem('agriis_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role) return parsed.role;
      }
    } catch {}
    return 'farmer';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const savedUser = localStorage.getItem('nexagri_current_user') || localStorage.getItem('agriis_current_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return DEFAULT_USERS['farmer'];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (localStorage.getItem('nexagri_is_auth') ?? localStorage.getItem('agriis_is_auth')) === 'true';
    } catch {
      return false;
    }
  });

  const [registeredFarmers, setRegisteredFarmers] = useState<UserProfile[]>([DEFAULT_USERS['farmer']]);

  // Load registered farmers from localStorage if available
  useEffect(() => {
    try {
      const savedFarmers = localStorage.getItem('nexagri_farmers') || localStorage.getItem('agriis_farmers');
      if (savedFarmers) {
        const parsed = JSON.parse(savedFarmers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRegisteredFarmers(parsed);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const targetUser = DEFAULT_USERS[newRole] || DEFAULT_USERS['farmer'];
    setUser(targetUser);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(targetUser));
    } catch {}
  };

  const loginWithCredentials = async (
    identifier: string,
    _password: string,
    roleHint?: UserRole
  ): Promise<boolean> => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Auto-detect or use role hint
    let determinedRole: UserRole = roleHint || 'farmer';
    if (cleanId.includes('buyer') || cleanId.includes('kaveri') || cleanId.includes('agro') || cleanId.includes('trader')) {
      determinedRole = 'buyer';
    }

    const baseUser = DEFAULT_USERS[determinedRole] || DEFAULT_USERS['farmer'];
    const loggedUser: UserProfile = {
      ...baseUser,
      phone: identifier.includes('@') ? baseUser.phone : identifier,
      name: baseUser.name
    };

    setUser(loggedUser);
    setRoleState(determinedRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(loggedUser));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
    return true;
  };

  const registerUser = async (
    name: string,
    mobile: string,
    _email: string,
    _password: string,
    selectedRole: UserRole
  ): Promise<boolean> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const formattedPhone = mobile.startsWith('+91') ? mobile : `+91 ${mobile.trim()}`;
    const baseUser = DEFAULT_USERS[selectedRole] || DEFAULT_USERS['farmer'];

    const newUser: UserProfile = {
      ...baseUser,
      name: name.trim() || (selectedRole === 'farmer' ? `Kisan ${mobile.slice(-4)}` : 'Verified Buyer'),
      phone: formattedPhone,
      role: selectedRole,
      kisanId: selectedRole === 'farmer' ? `TN-CBE-2026-${randomSuffix}` : undefined,
      businessName: selectedRole === 'buyer' ? `${name.trim()} Traders` : undefined,
      verified: true,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    if (selectedRole === 'farmer') {
      const updatedFarmers = [newUser, ...registeredFarmers.filter(f => f.phone !== newUser.phone)];
      setRegisteredFarmers(updatedFarmers);
      try {
        localStorage.setItem('nexagri_farmers', JSON.stringify(updatedFarmers));
      } catch {}
    }

    setUser(newUser);
    setRoleState(selectedRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(newUser));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
    return true;
  };

  const loginWithOtp = async (phone: string, selectedRole: UserRole = 'farmer'): Promise<boolean> => {
    // Find if farmer already registered with this phone
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.trim()}`;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    const existingFarmer = registeredFarmers.find(f => f.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

    const target: UserProfile = existingFarmer || {
      ...DEFAULT_USERS[selectedRole],
      phone: formattedPhone,
      name: selectedRole === 'farmer' ? `Kisan ${cleanPhone.slice(-4)}` : DEFAULT_USERS[selectedRole].name
    };

    setUser(target);
    setRoleState(selectedRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(target));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
    return true;
  };

  const loginWithKisanId = async (kisanId: string, _pin: string): Promise<boolean> => {
    const cleanId = kisanId.trim().toUpperCase();
    const existing = registeredFarmers.find(f => f.kisanId?.toUpperCase() === cleanId) || DEFAULT_USERS['farmer'];
    
    setUser({ ...existing, kisanId: cleanId });
    setRoleState('farmer');
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(existing));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
    return true;
  };

  const registerFarmer = async (farmerData: Partial<UserProfile>): Promise<boolean> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const statePrefix = (farmerData.state?.substring(0, 2) || 'TN').toUpperCase();
    const distPrefix = (farmerData.district?.substring(0, 3) || 'CBE').toUpperCase();
    const newKisanId = farmerData.kisanId || `${statePrefix}-${distPrefix}-2026-${randomSuffix}`;

    const newFarmer: UserProfile = {
      ...DEFAULT_USERS['farmer'],
      ...farmerData,
      role: 'farmer',
      kisanId: newKisanId,
      verified: true,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    const updatedFarmers = [newFarmer, ...registeredFarmers.filter(f => f.phone !== newFarmer.phone)];
    setRegisteredFarmers(updatedFarmers);
    setUser(newFarmer);
    setRoleState('farmer');
    setIsAuthenticated(true);

    try {
      localStorage.setItem('nexagri_farmers', JSON.stringify(updatedFarmers));
      localStorage.setItem('nexagri_current_user', JSON.stringify(newFarmer));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
    return true;
  };

  const quickDemoLogin = (targetRole: UserRole = 'farmer') => {
    const targetUser = DEFAULT_USERS[targetRole] || DEFAULT_USERS['farmer'];
    setUser(targetUser);
    setRoleState(targetRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('nexagri_current_user', JSON.stringify(targetUser));
      localStorage.setItem('nexagri_is_auth', 'true');
    } catch {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('nexagri_is_auth', 'false');
      localStorage.setItem('agriis_is_auth', 'false');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated,
        loginWithOtp,
        loginWithKisanId,
        loginWithCredentials,
        registerFarmer,
        registerUser,
        quickDemoLogin,
        logout,
        registeredFarmers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

