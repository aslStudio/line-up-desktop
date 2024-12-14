import React, { createContext, useContext, useEffect, useState } from "react"

import { Theme } from './types'
import { getUserTheme, setUserTheme } from './model'

type Context = {
    theme: Theme
    setTheme: (v: Theme) => void
}

const themeContext = createContext<Context>({
    theme: 'dark',
    setTheme: () => {}
})

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
    children
}) => {
    const [theme, setTheme] = useState<Theme>('dark')
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

    function onChangeTheme(v: Theme) {
        setTransitionStage('fade-out')
        setTimeout(() => {
            setTheme(v)
            setUserTheme(v)
        }, 300)
    }

    useEffect(() => {
        setTheme(getUserTheme())
    }, [])

    return (
        <themeContext.Provider
            value={{
                theme,
                setTheme: onChangeTheme,
            }}
        >
            <div
                className={transitionStage}
                onAnimationEnd={() => {
                    if (transitionStage === 'fade-out') {
                        setTransitionStage('fade-in')
                    }
                }}
            >
                {children}
            </div>
        </themeContext.Provider>
    )
}

export const useThemeProvider = () => useContext(themeContext)