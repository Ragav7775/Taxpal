import { useState, useEffect } from "react";

export function useUserData() {
    const [userData, setUserData] = useState(() => {
        const raw = localStorage.getItem("user") || "{}";
        return JSON.parse(raw);
    });

    useEffect(() => {
        const handleUpdate = () => {
            const raw = localStorage.getItem("user") || "{}";
            setUserData(JSON.parse(raw));
        };
        window.addEventListener("userDataUpdated", handleUpdate);
        window.addEventListener("storage", handleUpdate);

        return () => {
            window.removeEventListener("userDataUpdated", handleUpdate);
            window.removeEventListener("storage", handleUpdate);
        };
    }, []);

    return userData;
};
