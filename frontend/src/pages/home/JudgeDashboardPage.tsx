import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
	Award,
	CheckCircle2,
	ExternalLink,
	Users,
	Building2,
	Send,
	ArrowRight,
	Info,
	Edit3,
} from "lucide-react";
import { Button, Card, Badge } from "../../components/ui";
import { HomeLayout } from "../../components/home";
import { type UseMutationResult } from "@tanstack/react-query";
import type {
	JudgeCategory,
	JudgeDashboardData,
	JudgeProject,
} from "../../utils/dataTypes";

export default function JudgeDashboardPage({
	greetingName,
	isLoading,
	dashboardData,
	submitCategoryMutation,
}: {
	greetingName: string;
	isLoading: boolean;
	dashboardData?: JudgeDashboardData | null;
	submitCategoryMutation: UseMutationResult;
}) {
	const navigate = useNavigate();

	return (
		<HomeLayout>
			<div className="space-y-6 sm:space-y-8 select-none">
				{/* Welcome Greeting Hero Banner */}
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-navy to-primary-dark p-6 sm:p-8 text-white shadow-2xl"
				>
					<div className="relative z-10 max-w-3xl space-y-3">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-gold-light">
							<Award className="w-3.5 h-3.5" />
							<span>Judges' Evaluation Panel</span>
						</div>

						<h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
							Welcome back, {greetingName}!
						</h1>

						<p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
							Select an entry under your assigned categories below to evaluate
							metrics, input criterion scores, and finalize category
							evaluations.
						</p>
					</div>
				</motion.div>

				{/* Loading Skeleton */}
				{isLoading ? (
					<div className="space-y-6">
						<div className="h-8 bg-border rounded w-1/4 animate-pulse" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((n) => (
								<div
									key={n}
									className="h-64 bg-border rounded-3xl animate-pulse"
								/>
							))}
						</div>
					</div>
				) : !dashboardData || dashboardData.categories.length === 0 ? (
					<Card
						variant="surface"
						className="p-8 text-center space-y-4 rounded-3xl border border-border"
					>
						<Info className="w-10 h-10 text-text-muted mx-auto" />
						<h2 className="text-lg font-bold text-navy">
							No Assigned Evaluation Categories
						</h2>
						<p className="text-xs text-text-secondary max-w-md mx-auto">
							There are currently no exhibition categories assigned to your
							judge profile. Please contact the portal administrator.
						</p>
					</Card>
				) : (
					/* Categories List */
					<div className="space-y-12">
						{dashboardData.categories.map((category: JudgeCategory) => {
							const totalProjects = category.projects.length;
							const scoredCount = category.projects.filter(
								(p: JudgeProject) =>
									p.scoring_status === "draft_saved" ||
									p.scoring_status === "submitted",
							).length;
							const canSubmitCategory =
								totalProjects > 0 &&
								scoredCount === totalProjects &&
								!category.all_submitted;

							return (
								<section key={category.id} className="space-y-6">
									{/* Category Header Bar */}
									<div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border shadow-md flex flex-col items-start sm:items-center justify-between gap-4">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Building2 className="w-5 h-5 text-primary" />
												<h2 className="text-xl font-black text-navy">
													{category.name}
												</h2>
											</div>
											{category.description && (
												<p className="text-xs text-text-secondary">
													{category.description}
												</p>
											)}
										</div>

										<div className="flex self-start items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
											<span className="text-xs text-center font-bold text-navy px-3 py-2.5 rounded-xl bg-background border border-border">
												<strong className="text-primary font-black">
													{scoredCount}
												</strong>{" "}
												/ {totalProjects} Scored
											</span>

											{category.all_submitted ? (
												<Badge
													variant="success"
													size="md"
													icon={<CheckCircle2 className="w-4 h-4" />}
												>
													Category Evaluation Finalized
												</Badge>
											) : (
												<Button
													variant="primary"
													size="sm"
													disabled={
														!canSubmitCategory ||
														submitCategoryMutation.isPending
													}
													isLoading={submitCategoryMutation.isPending}
													leftIcon={<Send className="w-4 h-4" />}
													onClick={() =>
														submitCategoryMutation.mutate(category.id)
													}
													className="font-extrabold py-2.5"
												>
													Submit All
												</Button>
											)}
										</div>
									</div>

									{/* Category Projects Grid */}
									{category.projects.length === 0 ? (
										<div className="p-6 rounded-2xl bg-background border border-border text-xs text-text-muted text-center italic">
											No project submissions in this category yet.
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{category.projects.map((project: JudgeProject) => (
												<Card
													key={project.id}
													variant="surface"
													className="group relative flex flex-col h-full overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 rounded-3xl p-5 space-y-4"
												>
													{/* Media Header */}
													<div className="relative h-44 w-full bg-background rounded-2xl overflow-hidden border border-border/80">
														<img
															src={project.thumbnail_url}
															alt={project.title}
															className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
															loading="lazy"
														/>
														<div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

														<div className="absolute top-3 left-3 right-3 flex items-center justify-between">
															<span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-navy/90 text-white backdrop-blur-md border border-white/20">
																{project.registration_code}
															</span>

															<Badge
																variant={
																	project.scoring_status === "submitted"
																		? "success"
																		: project.scoring_status === "draft_saved"
																			? "gold"
																			: "outline"
																}
																size="sm"
															>
																{project.scoring_status === "submitted"
																	? "Submitted"
																	: project.scoring_status === "draft_saved"
																		? "Draft Saved"
																		: "Not Scored"}
															</Badge>
														</div>
													</div>

													{/* Content Body */}
													<div className="flex-1 flex flex-col justify-between space-y-3">
														<div className="space-y-1.5">
															<h3 className="text-base font-bold text-navy leading-snug group-hover:text-primary transition-colors">
																{project.title}
															</h3>
															{project.tagline && (
																<p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
																	{project.tagline}
																</p>
															)}
														</div>

														{/* Team / Creator Affordance */}
														<div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-navy font-semibold">
															<span className="flex items-center gap-1.5 truncate">
																<Users className="w-3.5 h-3.5 text-primary shrink-0" />
																<span className="truncate">
																	{project.team_name || project.contact_name}
																</span>
															</span>

															{project.live_preview_url && (
																<a
																	href={project.live_preview_url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-primary hover:text-primary-dark font-bold text-[11px] inline-flex items-center gap-1 shrink-0"
																>
																	<span>Demo</span>
																	<ExternalLink className="w-3 h-3" />
																</a>
															)}
														</div>

														{/* Action Buttons */}
														<div className="pt-2">
															{project.scoring_status !== "not_scored" ? (
																<div className="flex items-center gap-2">
																	<Button
																		variant="outline"
																		size="sm"
																		fullWidth
																		disabled
																		leftIcon={
																			<CheckCircle2 className="w-4 h-4 text-success" />
																		}
																		className="font-extrabold py-2.5 opacity-90 cursor-not-allowed bg-success-bg/40 text-success border-success/30"
																	>
																		{project.scoring_status === "submitted"
																			? "Submitted"
																			: "Scored"}
																	</Button>

																	<button
																		type="button"
																		title="Edit Scores"
																		aria-label="Edit Scores"
																		onClick={() =>
																			navigate({
																				to: "/home/judge/score",
																				search: { projectId: project.id },
																			})
																		}
																		className="p-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary-light/60 hover:border-primary/60 transition-all cursor-pointer shrink-0 shadow-xs"
																	>
																		<Edit3 className="w-4 h-4" />
																	</button>
																</div>
															) : (
																<Button
																	variant="primary"
																	size="sm"
																	fullWidth
																	rightIcon={
																		<ArrowRight className="w-3.5 h-3.5" />
																	}
																	onClick={() =>
																		navigate({
																			to: "/home/judge/score",
																			search: { projectId: project.id },
																		})
																	}
																	className="font-extrabold py-2.5"
																>
																	Score
																</Button>
															)}
														</div>
													</div>
												</Card>
											))}
										</div>
									)}
								</section>
							);
						})}
					</div>
				)}
			</div>
		</HomeLayout>
	);
}
