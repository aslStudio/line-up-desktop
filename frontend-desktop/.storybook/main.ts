import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    staticDirs: ['../public'],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
        "@storybook/preset-scss"
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            css: {
                postcss: null,
                preprocessorOptions: {
                    scss: {
                        additionalData: `
                            @use "@/shared/styles/theme" as *;
                            @use "@/shared/styles/common" as *;
                            @use "@/shared/styles/reset" as *;
                            @use "@/shared/styles/vars/typography" as *;
                            @use "@/shared/styles/storybook-settings" as *;
                        `,
                    },
                },
            },
        })
    },
}
export default config
