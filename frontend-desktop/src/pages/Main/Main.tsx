import { useThemeProvider } from '@/shared/lib/providers'
import styles from './Main.module.scss'

export const Main = () => {
    const { theme, setTheme } = useThemeProvider()

    return (
        <div>
            <h1 className={styles.title}>MAIN</h1>
            <button
                onClick={() => {
                    if (theme === 'light') {
                        setTheme('dark')
                    } else {
                        setTheme('light')
                    }
                }}
            >
                Toggle
            </button>
        </div>
    )
}