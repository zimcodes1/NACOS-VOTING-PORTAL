import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RegisterProjectPage from "../../pages/RegisterProjectPage";
import { toast } from "../../components/ui/Toast";
import {
  fetchCategories,
  registerProject,
  lookupProject,
  updateProject,
  uploadImage,
} from "../../api/registerAPI";
import type { Category, ExhibitionTrack, Project } from "../../utils/dataTypes";

type Step = 1 | 2 | 3 | 4;

export default function Register() {
  // Mode: "register" | "lookup"
  const [mode, setMode] = useState<"register" | "lookup">("register");

  // Step state for multi-step onboarding flow
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form State
  const [track, setTrack] = useState<ExhibitionTrack>("software");
  const [categoryId, setCategoryId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Image Upload / URL State
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const [livePreviewUrl, setLivePreviewUrl] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");

  // Team & Contact State
  const [teamName, setTeamName] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [matricNumber, setMatricNumber] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [showContactPublicly, setShowContactPublicly] = useState<boolean>(true);

  // Submission / Result State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredProject, setRegisteredProject] = useState<Project | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState<boolean>(false);

  // Edit State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [wasEditing, setWasEditing] = useState<boolean>(false);

  // Lookup Form State
  const [lookupCode, setLookupCode] = useState<string>("");
  const [lookupEmail, setLookupEmail] = useState<string>("");
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
  const [lookedUpProject, setLookedUpProject] = useState<Project | null>(null);

  // Fetch categories belonging to the selected track from backend
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories", track],
    queryFn: () => fetchCategories(track),
  });

  const selectedCategory = categories.find((c) => String(c.id) === String(categoryId));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.warning("Image size must be smaller than 10MB.");
      return;
    }

    setIsUploadingImage(true);
    const res = await uploadImage(file);
    setIsUploadingImage(false);

    if (res.success && res.url) {
      setThumbnailUrl(res.url);
      toast.success("Image uploaded successfully!");
    } else {
      toast.error(res.error || "Image upload failed.");
    }
  };

  const MATRIC_REGEX = /^(?:FT\d{2}[A-Z]{3,4}\d{3,5}|[A-Z]{2,5}\/\d{4}\/\d{3,5}|[A-Z0-9]{7,15})$/i;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!categoryId) {
        toast.warning("Please select a project category to continue.");
        return;
      }
    } else if (currentStep === 2) {
      if (!title.trim() || !description.trim()) {
        toast.warning("Please enter a title and description for your project.");
        return;
      }
      if (!thumbnailUrl.trim()) {
        toast.warning("Please upload an image or provide a thumbnail URL.");
        return;
      }
    } else if (currentStep === 3) {
      if (!teamName.trim() || !contactName.trim() || !contactEmail.trim()) {
        toast.warning("Please fill in your team and contact information.");
        return;
      }
      if (!matricNumber.trim()) {
        toast.warning("Please enter your matriculation number.");
        return;
      }
      if (!MATRIC_REGEX.test(matricNumber.trim())) {
        toast.warning("Invalid matriculation number format. E.g. FT24CMP0123");
        return;
      }
      if (!level) {
        toast.warning("Please select your academic level.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      category_id: categoryId,
      track,
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      live_preview_url: livePreviewUrl.trim(),
      team_name: teamName.trim(),
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      matric_number: matricNumber.trim().toUpperCase(),
      level: level.trim(),
      show_contact_publicly: showContactPublicly,
      tags,
    };

    if (editingProjectId) {
      const res = await updateProject(editingProjectId, payload, lookupCode, lookupEmail);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setRegisteredProject(res.data);
        setLookedUpProject(res.data);
        setEditingProjectId(null);
        toast.success("Project updated successfully!");
      } else {
        toast.error(res.error || "Failed to update project.");
      }
    } else {
      const res = await registerProject(payload);
      setIsSubmitting(false);

      if (res.success && res.data) {
        setRegisteredProject(res.data);
        toast.success("Project registration submitted successfully!");
      } else {
        toast.error(res.error || "Failed to submit project registration.");
      }
    }
  };

  const handleCopyCode = () => {
    if (!registeredProject?.registration_code) return;
    navigator.clipboard.writeText(registeredProject.registration_code);
    setHasCopiedCode(true);
    toast.success("Registration code copied to clipboard!");
    setTimeout(() => setHasCopiedCode(false), 3000);
  };

  const handlePerformLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim() || !lookupEmail.trim()) {
      toast.warning("Please enter both your Registration Code and Contact Email.");
      return;
    }
    setIsLookingUp(true);
    const res = await lookupProject(lookupCode.trim(), lookupEmail.trim());
    setIsLookingUp(false);

    if (res.success && res.data) {
      setLookedUpProject(res.data);
      toast.success("Project status retrieved!");
    } else {
      setLookedUpProject(null);
      toast.error(res.error || "No matching project found.");
    }
  };

  const handleTriggerEdit = () => {
    if (!lookedUpProject) return;
    setTrack(lookedUpProject.track);
    setCategoryId(lookedUpProject.category_id);
    setTitle(lookedUpProject.title);
    setTagline(lookedUpProject.tagline || "");
    setDescription(lookedUpProject.description || "");
    setImageInputMode(lookedUpProject.thumbnail_url?.startsWith("http") ? "url" : "upload");
    setThumbnailUrl(lookedUpProject.thumbnail_url || "");
    setLivePreviewUrl(lookedUpProject.live_preview_url || "");
    setTagsInput(Array.isArray(lookedUpProject.tags) ? lookedUpProject.tags.join(", ") : "");
    setTeamName(lookedUpProject.team_name || "");
    setContactName(lookedUpProject.contact_name || "");
    setContactEmail(lookedUpProject.contact_email || "");
    setContactPhone(lookedUpProject.contact_phone || "");
    setMatricNumber(lookedUpProject.matric_number || "");
    setLevel(lookedUpProject.level || "");
    setShowContactPublicly(lookedUpProject.show_contact_publicly);
    setEditingProjectId(lookedUpProject.id);
    setWasEditing(true);
    setMode("register");
    setCurrentStep(1);
    toast.info("Entering edit mode. Update your project details across the steps.");
  };

  const handleCancelEdit = () => {
    setTrack("software");
    setCategoryId("");
    setTitle("");
    setTagline("");
    setDescription("");
    setImageInputMode("upload");
    setThumbnailUrl("");
    setLivePreviewUrl("");
    setTagsInput("");
    setTeamName("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setMatricNumber("");
    setLevel("");
    setShowContactPublicly(true);
    setEditingProjectId(null);
    setWasEditing(false);
    setMode("lookup");
    setCurrentStep(1);
    toast.info("Edit cancelled.");
  };

  return (
    <RegisterProjectPage
      mode={mode}
      setMode={setMode}
      currentStep={currentStep}
      track={track}
      setTrack={setTrack}
      categoryId={categoryId}
      setCategoryId={setCategoryId}
      title={title}
      setTitle={setTitle}
      tagline={tagline}
      setTagline={setTagline}
      description={description}
      setDescription={setDescription}
      imageInputMode={imageInputMode}
      setImageInputMode={setImageInputMode}
      thumbnailUrl={thumbnailUrl}
      setThumbnailUrl={setThumbnailUrl}
      isUploadingImage={isUploadingImage}
      livePreviewUrl={livePreviewUrl}
      setLivePreviewUrl={setLivePreviewUrl}
      tagsInput={tagsInput}
      setTagsInput={setTagsInput}
      teamName={teamName}
      setTeamName={setTeamName}
      contactName={contactName}
      setContactName={setContactName}
      contactEmail={contactEmail}
      setContactEmail={setContactEmail}
      contactPhone={contactPhone}
      setContactPhone={setContactPhone}
      matricNumber={matricNumber}
      setMatricNumber={setMatricNumber}
      level={level}
      setLevel={setLevel}
      showContactPublicly={showContactPublicly}
      setShowContactPublicly={setShowContactPublicly}
      isSubmitting={isSubmitting}
      registeredProject={registeredProject}
      hasCopiedCode={hasCopiedCode}
      lookupCode={lookupCode}
      setLookupCode={setLookupCode}
      lookupEmail={lookupEmail}
      setLookupEmail={setLookupEmail}
      isLookingUp={isLookingUp}
      lookedUpProject={lookedUpProject}
      categories={categories}
      isCategoriesLoading={isCategoriesLoading}
      selectedCategory={selectedCategory}
      onFileUpload={handleFileUpload}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onSubmitRegistration={handleSubmitRegistration}
      onCopyCode={handleCopyCode}
      onPerformLookup={handlePerformLookup}
      onTriggerEdit={handleTriggerEdit}
      isEditing={!!editingProjectId}
      onCancelEdit={handleCancelEdit}
      wasEditing={wasEditing}
    />
  );
}