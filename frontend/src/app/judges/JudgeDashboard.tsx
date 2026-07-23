import JudgeDashboardPage from "../../pages/home/JudgeDashboardPage";
import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { judgeAuthStore } from "../../utils/judgeAuthStore";
import { useNavigate } from "@tanstack/react-router";
import {
	fetchJudgeDashboardData,
	submitCategoryScores,
} from "../../api/judgingAPI";
import { toast } from "../../components/ui";

export default function JudgeDashboard() {
	const queryClient = useQueryClient();
	const judge = judgeAuthStore.getJudge();
	const navigate = useNavigate();
	// Redirect to login if not authenticated
	useEffect(() => {
		if (!judgeAuthStore.isLoggedIn()) {
			navigate({ to: "/home/judge-login" });
		}
	}, [navigate]);

	// Fetch Judge Dashboard Data
	const { data: dashboardData, isLoading } = useQuery({
		queryKey: ["judgeDashboardData", judge?.id],
		queryFn: () => fetchJudgeDashboardData(judge?.id),
		enabled: !!judge,
	});

	// Extract judge title and first name for personalized welcome greeting
	const greetingName = useMemo(() => {
		if (!judge?.name) return "Specialist Judge";
		const firstName = judge.name.trim().split(" ")[0];
		return judge.title ? `${judge.title} ${firstName}` : firstName;
	}, [judge]);

	// Category Score Submission Mutation
	const submitCategoryMutation = useMutation<
		{ success: boolean; error?: string },
		Error,
		unknown
	>({
		mutationFn: async (categoryId: unknown) => {
			if (typeof categoryId !== "string") {
				throw new Error("Invalid category ID.");
			}

			return submitCategoryScores(categoryId, judge?.id);
		},
		onSuccess: (res) => {
			if (res.success) {
				toast.success("Category Evaluation Submitted!", {
					description:
						"All project evaluations in this category have been finalized.",
				});
				queryClient.invalidateQueries({ queryKey: ["judgeDashboardData"] });
			} else {
				toast.error("Submission Failed", { description: res.error });
			}
		},
	});

	if (!judge) return null;

	return (
		<JudgeDashboardPage
			dashboardData={dashboardData}
			isLoading={isLoading}
			submitCategoryMutation={submitCategoryMutation}
			greetingName={greetingName}
		/>
	);
}
