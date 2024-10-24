"use client";
import React, { useEffect, useState } from 'react';
import { handleOAuthToken } from './api/oauth';
import { initWebSocket } from './api/websocket';
import { initOAuth } from './components/Auth';
import './styles/fonts.css';
import Auth from './components/Auth';
import GameSteps from './components/GameSteps';
import Home from './components/Home';

const HomePage: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkAccessToken = async () => {
            const response = await fetch('https://api.scouttoon.info/get-token', {
                method: 'GET',
                credentials: 'include', // Cookies will be sent automatically
            });

            if (response.ok) {
                console.log("Token found.");
                const { userId } = await response.json();
                setIsAuth(true);
                initWebSocket(setIsConnected, userId);
            } else {
                console.log("No token found.");
                initOAuth();
            }
        };
    
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get('access_token');
    
        if (accessToken) {
            handleOAuthToken(fragment).then((userId) => {
                setIsAuth(true);
                if (userId) {
                    initWebSocket(setIsConnected, userId);
                } else {
                    console.log("ID error");
                }
            });
        } else {
            checkAccessToken();
        }
    }, []);
    
    

    return (
        <div className="flex flex-col h-screen bg-gags-pattern bg-repeat overflow-y-auto">
            {/* Authentication */}
            {!isAuth && <Auth />}
        
            {/* Connecting Steps */}
            {isAuth && !isConnected && <GameSteps />}
        
            {/* Home Screen */}
            {isAuth && isConnected && <Home />}
        </div>
    );
};      

export default HomePage;
