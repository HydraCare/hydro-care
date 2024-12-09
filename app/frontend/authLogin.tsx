import React, { createContext, useState, useContext } from 'react';

// Tạo Context để quản lý trạng thái đăng nhập
const AuthContext = createContext({
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false); // Khi đăng xuất, cập nhật trạng thái

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>

        </AuthContext.Provider>
    );
};