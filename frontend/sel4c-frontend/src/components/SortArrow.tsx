import React from "react";

interface SortArrowProps {
    direction: string;
}

export const SortArrow: React.FC<SortArrowProps> = ({ direction }) => {
    if (!direction) {
        return null;
    } else if (direction === 'ascending') {
        return <span>⬆️</span>;
    } else {
        return <span>⬇️</span>;
    }
};
