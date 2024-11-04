import { useState, useEffect } from "react";

const useResponsiveSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return [isSidebarOpen, setIsSidebarOpen];
};

export default useResponsiveSidebar;
