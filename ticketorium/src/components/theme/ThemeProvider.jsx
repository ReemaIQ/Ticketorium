import { useEffect } from "react";

function ThemeProvider({ loggedInUser, dummyUsersRef, dummyUniversitiesRef, children }) {
    useEffect(() => {
        const rootStyle = document.documentElement.style;

        const user = loggedInUser ? dummyUsersRef.current?.[loggedInUser] : null;
        const uniId = user?.university;
        const uniTheme = uniId
            ? dummyUniversitiesRef.current?.[uniId]?.["theme-colors"]
            : null;

        const fallbackTheme = {
            "secondary-color": "#1F4C76",
            "primary-color": "#1a1a1a",
            "accent-color": "#FFDF4F",
            "secondary-accent-color": "#0800FF",
            "footer-color": "#11223B",
            "warning-color": "#F54141",
            "success-color": "#46CA48",
            "filter-buttons": "oklch(49.6% 0.265 301.924)",
        };

        const theme = uniTheme || fallbackTheme;

        Object.entries(theme).forEach(([name, value]) => {
            rootStyle.setProperty(`--${name}`, value);
        });
    }, [loggedInUser, dummyUsersRef, dummyUniversitiesRef]);

    return children;
}

export default ThemeProvider;