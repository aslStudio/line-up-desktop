import { Theme } from './types'

const THEME_STORAGE_NAME = 'THEME'

export function getUserTheme(): Theme {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_NAME)

    if (isValidTheme(savedTheme)) {
        setDataSet(savedTheme)
        return savedTheme
    }

    const isLightPrefer = window.matchMedia('(prefers-color-scheme: light)')
    if (isLightPrefer) {
        setDataSet('light')
        return 'light'
    }

    setDataSet('dark')
    return 'dark'
}

export function setUserTheme(v: Theme) {
    setDataSet(v)
    window.localStorage.setItem(THEME_STORAGE_NAME, v)
}

function isValidTheme(v: string | null): v is Theme {
    if (v) {
        return v === 'dark' || v === 'light'
    }

    return false
}

function setDataSet(v: Theme) {
    document.documentElement.dataset.theme = v
}