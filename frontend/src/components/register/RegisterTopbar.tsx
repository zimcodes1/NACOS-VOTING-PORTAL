import { ChevronLeft, Edit } from "lucide-react"
import { Button } from "../ui"
import { useNavigate } from "@tanstack/react-router";

export default function Topbar({ mode, setMode }: {
    mode: "register" | "lookup";
    setMode: (mode: "register" | "lookup") => void
}) {
    const navigate = useNavigate()
    return (
        <header className="w-full border-b border-border/80 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
                <span onClick={() => navigate({ to: "/home" })} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-border p-1 flex items-center justify-center text-text-primary shadow-md shadow-primary/20 shrink-0">
                        <ChevronLeft size={24} />
                    </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-extrabold text-navy leading-none tracking-tight">
                            NACOS EXHIBITION
                        </div>
                        <div className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">
                            Entrant Portal
                        </div>
                    </div>
                </span>

                <div className="flex items-center gap-3">
                    <Button
                        variant={mode === "register" ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setMode("register")}
                    >
                        Register Entry
                    </Button>
                    <Button
                        variant={mode === "lookup" ? "primary" : "ghost"}
                        size="sm"
                        leftIcon={<Edit className="w-3.5 h-3.5" />}
                        onClick={() => setMode("lookup")}
                        className="py-2 px-3"
                    >
                        Edit entry
                    </Button>
                </div>
            </div>
        </header>

    )
}