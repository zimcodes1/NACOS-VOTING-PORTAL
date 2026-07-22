import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { Button, Input, Card } from "../../components/ui";

interface JudgeLoginPageProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoading: boolean;
    error: string | null;
    onSubmit: (e: React.FormEvent) => void;
}

export const JudgeLoginPage: React.FC<JudgeLoginPageProps> = ({
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    error,
    onSubmit,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background select-none">
            <div className="max-w-md w-full space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <div className="mx-auto w-13 h-13 rounded-2xl bg-white border border-border p-1 flex items-center justify-center text-white shadow-md shadow-primary/20">
                        <img src="/images/nacos-logo.png" alt="" />
                    </div>
                    <h2 className="text-2xl font-black text-navy tracking-tight mt-3">
                        Judges' Evaluation Portal
                    </h2>
                    <p className="text-xs text-text-secondary">
                        Sign in with your pre-configured credentials to evaluate Software Track submissions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card
                        variant="surface"
                        className="p-6 sm:p-8 rounded-3xl border border-border shadow-2xl bg-surface space-y-6"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 flex items-start gap-2.5 text-xs font-semibold"
                            >
                                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <Input
                                label="Username / Email"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                leftIcon={<User className="w-4 h-4 text-text-muted" />}
                                autoFocus
                                disabled={isLoading}
                            />

                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none hover:text-navy text-text-muted hover:text-navy transition-colors cursor-pointer flex items-center justify-center p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                                disabled={isLoading}
                            />

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                type="submit"
                                isLoading={isLoading}
                                leftIcon={<Sparkles className="w-4 h-4" />}
                                className="py-3 mt-2 font-extrabold"
                            >
                                Sign In to Panel
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default JudgeLoginPage;
