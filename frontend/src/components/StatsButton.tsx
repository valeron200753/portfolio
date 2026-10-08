import { memo } from "react";

interface StatsButtonProps {
    onClick: () => void;
}

const StatsButton = memo(function StatsButton({
    onClick
}: StatsButtonProps) {
    console.log("StatsButton rendered");

    return (
        <button onClick={onClick}>
            Say hello
        </button>
    );
});

export default StatsButton;