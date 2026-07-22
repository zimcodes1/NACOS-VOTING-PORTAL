import { type Judge } from "./dataTypes";

const JUDGE_STORE_KEY = "nse_judge_auth";

export const judgeAuthStore = {
  getJudge(): Judge | null {
    try {
      const data = localStorage.getItem(JUDGE_STORE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  
  setJudge(judge: Judge): void {
    try {
      localStorage.setItem(JUDGE_STORE_KEY, JSON.stringify(judge));
    } catch (e) {
      console.warn("Failed to set judge in localStorage:", e);
    }
  },
  
  clear(): void {
    try {
      localStorage.removeItem(JUDGE_STORE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  },
  
  isLoggedIn(): boolean {
    return this.getJudge() !== null;
  }
};
