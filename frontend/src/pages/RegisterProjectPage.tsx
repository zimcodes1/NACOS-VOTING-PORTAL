import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Palette,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Search,
  Sparkles,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Edit,
} from "lucide-react";
import type { Category, ExhibitionTrack, Project } from "../utils/dataTypes";
import Topbar from "../components/register/RegisterTopbar";
import { Button, Input, Card, Badge } from "../components/ui";

export interface RegisterProjectPageProps {
  mode: "register" | "lookup";
  setMode: (mode: "register" | "lookup") => void;
  currentStep: 1 | 2 | 3 | 4;
  track: ExhibitionTrack;
  setTrack: (track: ExhibitionTrack) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  title: string;
  setTitle: (title: string) => void;
  tagline: string;
  setTagline: (tagline: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  imageInputMode: "upload" | "url";
  setImageInputMode: (mode: "upload" | "url") => void;
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  isUploadingImage: boolean;
  livePreviewUrl: string;
  setLivePreviewUrl: (url: string) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
  teamName: string;
  setTeamName: (name: string) => void;
  contactName: string;
  setContactName: (name: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  showContactPublicly: boolean;
  setShowContactPublicly: (show: boolean) => void;
  isSubmitting: boolean;
  registeredProject: Project | null;
  hasCopiedCode: boolean;
  lookupCode: string;
  setLookupCode: (code: string) => void;
  lookupEmail: string;
  setLookupEmail: (email: string) => void;
  isLookingUp: boolean;
  lookedUpProject: Project | null;
  categories: Category[];
  isCategoriesLoading: boolean;
  selectedCategory?: Category;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmitRegistration: (e: React.FormEvent) => void;
  onCopyCode: () => void;
  onPerformLookup: (e: React.FormEvent) => void;
  onTriggerEdit: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  wasEditing: boolean;
}

export const RegisterProjectPage: React.FC<RegisterProjectPageProps> = ({
  mode,
  setMode,
  currentStep,
  track,
  setTrack,
  categoryId,
  setCategoryId,
  title,
  setTitle,
  tagline,
  setTagline,
  description,
  setDescription,
  imageInputMode,
  setImageInputMode,
  thumbnailUrl,
  setThumbnailUrl,
  isUploadingImage,
  livePreviewUrl,
  setLivePreviewUrl,
  tagsInput,
  setTagsInput,
  teamName,
  setTeamName,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  showContactPublicly,
  setShowContactPublicly,
  isSubmitting,
  registeredProject,
  hasCopiedCode,
  lookupCode,
  setLookupCode,
  lookupEmail,
  setLookupEmail,
  isLookingUp,
  lookedUpProject,
  categories,
  isCategoriesLoading,
  selectedCategory,
  onFileUpload,
  onNextStep,
  onPrevStep,
  onSubmitRegistration,
  onCopyCode,
  onPerformLookup,
  onTriggerEdit,
  isEditing,
  onCancelEdit,
  wasEditing,
}) => {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Header Bar */}
      <Topbar mode={mode} setMode={setMode} />
      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {mode === "lookup" ? (
          /* Lookup Registration Status Card */
          <div className="max-w-xl mx-auto w-full space-y-6">
            <Card variant="surface" className="p-6 sm:p-8 space-y-6 rounded-3xl border border-border shadow-xl">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-navy tracking-tight">
                  Check Project Registration Status
                </h2>
                <p className="text-xs text-text-secondary">
                  Enter your assigned Registration Code (e.g. <code className="font-mono text-navy font-bold">SOFT_001</code>) and contact email.
                </p>
              </div>

              <form onSubmit={onPerformLookup} className="space-y-4 pt-2">
                <Input
                  label="Registration Code"
                  placeholder="e.g. SOFT_001, GRAP_001, AI_001"
                  value={lookupCode}
                  onChange={(e) => setLookupCode(e.target.value)}
                  leftIcon={<Sparkles className="w-4 h-4 text-text-muted" />}
                  autoFocus
                />

                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="e.g. lead@team.com"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  isLoading={isLookingUp}
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Lookup Status
                </Button>
              </form>

              {lookedUpProject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-background border border-border space-y-3 pt-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-navy">
                      {lookedUpProject.registration_code}
                    </span>
                    <Badge
                      variant={
                        lookedUpProject.registration_status === "confirmed"
                          ? "success"
                          : "warning"
                      }
                      size="sm"
                    >
                      {lookedUpProject.registration_status === "confirmed"
                        ? "Confirmed & Published"
                        : "Pending Verification"}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-navy">
                    {lookedUpProject.title}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Category: <strong className="text-navy">{lookedUpProject.category_name}</strong>
                  </p>
                  <p className="text-xs text-text-secondary">
                    Team: <strong className="text-navy">{lookedUpProject.team_name}</strong>
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={onTriggerEdit}
                    className="mt-3 py-3 bg-navy text-white hover:bg-navy/90"
                  >
                    Edit Entry
                  </Button>
                </motion.div>
              )}
            </Card>
          </div>
        ) : registeredProject ? (
          /* Post-Registration Success Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto w-full space-y-6"
          >
            <Card variant="surface" className="p-6 sm:p-10 space-y-6 rounded-3xl border border-border shadow-2xl">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-success-bg text-success flex items-center justify-center mx-auto border border-success/30 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                  {wasEditing ? "Project Updated!" : "Registration Received!"}
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                  Your project entry <strong className="text-navy">{registeredProject.title}</strong> has been {wasEditing ? "updated" : "submitted"}.
                </p>
              </div>

              {/* Generated Registration Code Display */}
              <div className="p-6 rounded-2xl bg-navy text-white space-y-3 text-center relative overflow-hidden shadow-xl">
                <div className="text-xs font-bold text-gold uppercase tracking-widest">
                  Your Official Registration Code
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black tracking-wider text-white">
                  {registeredProject.registration_code}
                </div>
                <Button
                  variant="gold"
                  size="sm"
                  leftIcon={hasCopiedCode ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  onClick={onCopyCode}
                  className="mx-auto"
                >
                  {hasCopiedCode ? "Copied!" : "Copy Registration Code"}
                </Button>
              </div>

              {/* CRITICAL SECURITY WARNING NOTICE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>CRITICAL: Save & Keep Your Code Private</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Please <strong>copy, screenshot, or write down</strong> your registration number (<code className="font-mono font-bold">{registeredProject.registration_code}</code>). Keep it safe and private — you will need this code together with your contact email to check your entry status or claim awards!
                </p>
              </div>

              {/* Payment Info Callout (if applicable) */}
              {registeredProject.registration_status === "pending_payment" && (
                <div className="p-4 rounded-2xl bg-primary-light/50 border border-primary/20 space-y-2 text-xs">
                  <div className="font-bold text-navy">
                    Payment Instructions
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    This category requires an exhibition fee. Quote your code <strong className="font-mono text-navy">{registeredProject.registration_code}</strong> as your payment narration. Your submission will be confirmed automatically once reviewed by organizers.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => (window.location.href = "/")}
                  className="py-3"
                >
                  Go to Discovery Grid
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Multi-Step Onboarding Registration Flow */
          <div className="space-y-6">
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 font-extrabold text-navy">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>Editing Entry for: <code className="font-mono text-primary bg-background px-2 py-1 rounded-lg border border-border">{lookedUpProject?.registration_code}</code></span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEdit}
                  className="text-red-600 hover:text-red-700 font-extrabold px-3 py-1.5"
                >
                  Cancel Edit
                </Button>
              </motion.div>
            )}
            {/* Top Onboarding Header & Progress Indicator Bar */}
            <div className="max-w-2xl mx-auto w-full space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Step {currentStep} of 4:{" "}
                  {currentStep === 1
                    ? "Track & Category"
                    : currentStep === 2
                      ? "Project Details & Media"
                      : currentStep === 3
                        ? "Team & Contact"
                        : "Review & Submit"}
                </span>
                <span className="text-text-muted font-mono">
                  {Math.round((currentStep / 4) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-navy"
                  initial={{ width: "25%" }}
                  animate={{ width: `${(currentStep / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Login-style Onboarding Card Container */}
            <Card variant="surface" className="max-w-2xl mx-auto w-full p-6 sm:p-10 rounded-3xl border border-border shadow-2xl space-y-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Track & Category Selection */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-navy tracking-tight">
                        Choose Exhibition Track & Category
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Select the track first — categories are loaded specifically for your chosen track.
                      </p>
                    </div>

                    {/* Exhibition Track Selector Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "software",
                          name: "Software Track",
                          desc: "Apps, Web & Code",
                          icon: <Code2 className="w-5 h-5 text-primary" />,
                        },
                        {
                          id: "graphic_design",
                          name: "Design Track",
                          desc: "Graphics & UI/UX",
                          icon: <Palette className="w-5 h-5 text-gold" />,
                        },
                        {
                          id: "ai_prompting",
                          name: "AI Prompting",
                          desc: "Generative AI Art",
                          icon: <BrainCircuit className="w-5 h-5 text-emerald-600" />,
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setTrack(item.id as ExhibitionTrack);
                            setCategoryId("");
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${track === item.id
                            ? "bg-navy text-white border-navy shadow-lg shadow-navy/20"
                            : "bg-background text-text-secondary border-border hover:border-navy/40"
                            }`}
                        >
                          <div className="p-2 rounded-xl bg-white/10 w-fit">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-xs font-extrabold">{item.name}</div>
                            <div className="text-[10px] opacity-75">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Category Selection Dropdown */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-navy flex items-center justify-between">
                        <span>Select Category for {track.toUpperCase()} *</span>
                        {selectedCategory?.requires_payment && (
                          <span className="text-[10px] text-gold font-bold">
                            Fee: ₦{selectedCategory.fee_amount}
                          </span>
                        )}
                      </label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        disabled={isCategoriesLoading}
                        className="w-full px-4 py-3 text-xs font-bold bg-background border border-border rounded-xl text-navy focus:outline-none focus:border-primary transition-all cursor-pointer shadow-xs"
                      >
                        <option value="">
                          {isCategoriesLoading ? "-- Loading Categories... --" : "-- Choose Category --"}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} {cat.requires_payment ? `(₦${cat.fee_amount})` : "(Free)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Project Details & Image Upload / URL */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-navy tracking-tight">
                        Project Details & Asset Preview
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Provide project title, abstract, and upload your image asset or paste a URL link.
                      </p>
                    </div>

                    <Input
                      label="Project Title *"
                      placeholder="e.g. Campus Voting & Analytics System"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <Input
                      label="Tagline / Short Pitch"
                      placeholder="e.g. Next-gen digital voting platform built for student elections"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy">
                        Project Description / Abstract *
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detailed description of features, problem solved, and tools used..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3.5 text-xs bg-background border border-border rounded-xl text-navy focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {/* Image Upload vs URL Toggle */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-navy">
                          Project Thumbnail / Artwork Image *
                        </label>
                        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
                          <button
                            type="button"
                            onClick={() => setImageInputMode("upload")}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${imageInputMode === "upload"
                              ? "bg-navy text-white shadow-xs"
                              : "text-text-muted hover:text-navy"
                              }`}
                          >
                            <Upload className="w-3 h-3" />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageInputMode("url")}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${imageInputMode === "url"
                              ? "bg-navy text-white shadow-xs"
                              : "text-text-muted hover:text-navy"
                              }`}
                          >
                            <LinkIcon className="w-3 h-3" />
                            Image URL
                          </button>
                        </div>
                      </div>

                      {imageInputMode === "upload" ? (
                        <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center bg-background transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onFileUpload}
                            disabled={isUploadingImage}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          {isUploadingImage ? (
                            <div className="flex flex-col items-center gap-2 text-xs font-bold text-primary">
                              <Loader2 className="w-6 h-6 animate-spin" />
                              <span>Uploading to Cloudinary...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                              <div className="text-xs font-bold text-navy">
                                Click or drag image file to upload
                              </div>
                              <div className="text-[10px] text-text-muted">
                                Supports PNG, JPG, WEBP (Max 10MB)
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input
                          label=""
                          placeholder="e.g. https://res.cloudinary.com/... or https://images.unsplash.com/..."
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                        />
                      )}

                      {/* Image Thumbnail Preview */}
                      {thumbnailUrl && (
                        <div className="relative h-40 w-full bg-background rounded-2xl border border-border overflow-hidden group">
                          <img
                            src={thumbnailUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-navy/80 px-3 py-1 rounded-lg backdrop-blur-md">
                              Image Preview Ready
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Input
                      label={track === "software" ? "Live Demo URL" : "High-Res Asset Preview Link"}
                      placeholder="e.g. https://github.com/user/repo or https://behance.net/..."
                      value={livePreviewUrl}
                      onChange={(e) => setLivePreviewUrl(e.target.value)}
                    />

                    <Input
                      label="Tags / Tech Stack"
                      placeholder="e.g. React, Django, Python, TailwindCSS"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      helperText="Comma separated tags"
                    />
                  </motion.div>
                )}

                {/* STEP 3: Team & Lead Contact */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-navy tracking-tight">
                        Team & Lead Contact Info
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Enter team or author details for certificate issuing & contact.
                      </p>
                    </div>

                    <Input
                      label="Team / Author Name *"
                      placeholder="e.g. CodeCraft Studios"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />

                    <Input
                      label="Lead Contact Full Name *"
                      placeholder="e.g. John Doe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Contact Email *"
                        type="email"
                        placeholder="e.g. lead@domain.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />

                      <Input
                        label="Contact Phone Number"
                        placeholder="e.g. 08012345678"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="showContact"
                        checked={showContactPublicly}
                        onChange={(e) => setShowContactPublicly(e.target.checked)}
                        className="rounded text-primary focus:ring-primary h-4 w-4 border-border cursor-pointer"
                      />
                      <label htmlFor="showContact" className="text-xs font-semibold text-navy cursor-pointer">
                        Allow public voters to view lead contact info on card
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Review & Submit */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-navy tracking-tight">
                        Review Submission Summary
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Review your entry details carefully before final registration.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-background border border-border space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-text-muted">Track / Category:</span>
                        <span className="font-bold text-navy">
                          {track.toUpperCase()} — {selectedCategory?.name || "Selected Category"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-text-muted">Title:</span>
                        <span className="font-bold text-navy">{title}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-text-muted">Team Name:</span>
                        <span className="font-bold text-navy">{teamName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Lead Contact Email:</span>
                        <span className="font-bold text-navy">{contactEmail}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Onboarding Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                {currentStep > 1 ? (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={onPrevStep}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onNextStep}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="gold"
                    size="lg"
                    isLoading={isSubmitting}
                    onClick={onSubmitRegistration}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    {isEditing ? "Update Registration" : "Submit Registration"}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-4 text-center text-xs text-text-muted">
        NACOS Software Exhibition Portal &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
};

export default RegisterProjectPage;
