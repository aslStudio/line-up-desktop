import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import { Main } from '@/pages/Main/Main.tsx'

import { RouterPaths } from "@/shared/lib"

export const RouterView = () => {
    const location = useLocation()

    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

    useEffect(() => {
        if (location !== displayLocation) setTransitionStage("fade-out");
    }, [location, displayLocation]);

    return (
        <div
            className={transitionStage}
            onAnimationEnd={() => {
                if (transitionStage === 'fade-out') {
                    setTransitionStage('fade-in')
                    setDisplayLocation(location)
                }
            }}
        >
            <Routes location={displayLocation}>
                <Route 
                    path={RouterPaths.MAIN}
                    element={<Main />}
                />
            </Routes>
        </div>
    )
}