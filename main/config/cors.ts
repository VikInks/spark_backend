import cors from "cors";

export function configureCors() {
    return cors({
        origin: 'http://localhost:5173',
        credentials: true
    });
}