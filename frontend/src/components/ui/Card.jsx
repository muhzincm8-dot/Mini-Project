import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn("glass-panel rounded-xl p-6 transition-all duration-300 hover:shadow-neon-blue/10 hover:shadow-2xl", className)}
            {...props}
        >
            {children}
        </div>
    );
}
