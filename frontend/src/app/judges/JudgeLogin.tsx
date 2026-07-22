import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import JudgeLoginPage from "../../pages/home/JudgeLoginPage";
import { loginJudge } from "../../api/judgingAPI";
import { judgeAuthStore } from "../../utils/judgeAuthStore";
import { toast } from "../../components/ui/Toast";

export default function JudgeLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (judgeAuthStore.isLoggedIn()) {
      navigate({ to: "/home/judge" });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await loginJudge(username.trim(), password);
    setIsLoading(false);

    if (res.success && res.judge) {
      judgeAuthStore.setJudge(res.judge);
      toast.success(`Welcome back, ${res.judge.name || "Judge"}!`);
      navigate({ to: "/home/judge" });
    } else {
      setError(res.error || "Invalid username or password.");
      toast.error(res.error || "Authentication failed.");
    }
  };

  return (
    <JudgeLoginPage
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
