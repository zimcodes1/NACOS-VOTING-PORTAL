import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ThumbsUp,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  Lock,
  Tag,
  Eye,
  Download,
} from "lucide-react";
import { type Project } from "../../utils/dataTypes";
import { Badge, Button, Card, Modal } from "../ui";

interface ProjectCardProps {
  project: Project;
  hasVotedInCategory: boolean;
  onVote: (project: Project) => void;
  onContactClick?: (project: Project) => void;
  exhibit?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  hasVotedInCategory,
  onVote,
  onContactClick,
  exhibit,
}) => {
  const [showContact, setShowContact] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  const isSoftwareTrack =
    !project.track || project.track === "software";
  const isGraphicOrAiTrack =
    project.track === "graphic_design" || project.track === "ai_prompting";

  const assetImageUrl = project.thumbnail_url || project.live_preview_url || "";

  const handleDownloadAsset = async () => {
    if (!assetImageUrl) return;
    try {
      const response = await fetch(assetImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${project.registration_code || "asset"}-design.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement("a");
      link.href = assetImageUrl;
      link.target = "_blank";
      link.download = `${project.registration_code || "asset"}-design.png`;
      link.click();
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          variant="surface"
          className="group relative flex flex-col h-full overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 rounded-2xl"
        >
          {/* Card Header Media Container */}
          <div className="relative h-48 w-full bg-background overflow-hidden rounded-xl">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

            {/* Top Badges: Registration Code & Track */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-navy/90 text-white backdrop-blur-md border border-white/20 shadow-xs">
                {project.registration_code}
              </span>

              {exhibit && (
                <Badge
                  variant={
                    project.track === "software"
                      ? "primary"
                      : project.track === "ai_prompting"
                      ? "success"
                      : "gold"
                  }
                  size="sm"
                  className="shadow-sm backdrop-blur-md"
                >
                  {project.track === "software"
                    ? "Software Track"
                    : project.track === "ai_prompting"
                    ? "AI Prompting"
                    : "Design Track"}
                </Badge>
              )}
            </div>

            {/* Category overlay label */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90 drop-shadow-sm flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gold-light" />
                {project.category_name}
              </span>

              {exhibit && project.featured && (
                <Badge variant="gold" size="sm" pulse>
                  Featured Entry
                </Badge>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-navy leading-snug tracking-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {exhibit && (
                <p className="text-xs font-medium text-text-secondary line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>
              )}
            </div>

            {/* Tags */}
            {!exhibit && project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-semibold text-text-muted bg-background border border-border rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Team & Contact info affordance */}
            {exhibit && (
              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5 font-semibold text-navy">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    {project.team_name}
                  </span>

                  {project.show_contact_publicly ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowContact(!showContact);
                        if (onContactClick) onContactClick(project);
                      }}
                      className="text-primary hover:text-primary-dark font-bold text-[11px] underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      {showContact ? "Hide Contact" : "Contact Team"}
                    </button>
                  ) : (
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private Contact
                    </span>
                  )}
                </div>

                {/* Revealed Contact details (if allowed) */}
                {showContact && project.show_contact_publicly && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 rounded-xl bg-primary-light/40 border border-primary/20 text-xs space-y-1.5"
                  >
                    <div className="font-semibold text-primary-dark text-[11px]">
                      Lead: {project.contact_name}
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Mail className="w-3 h-3 text-primary shrink-0" />
                      <a
                        href={`mailto:${project.contact_email}`}
                        className="hover:underline truncate"
                      >
                        {project.contact_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                      <Phone className="w-3 h-3 text-primary shrink-0" />
                      <a
                        href={`tel:${project.contact_phone}`}
                        className="hover:underline"
                      >
                        {project.contact_phone}
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Action Row: Live Demo Link / View Asset Button & Vote Button */}
            <div className="pt-3 flex items-center justify-between gap-3 border-t border-border">
              {isSoftwareTrack ? (
                project.live_preview_url ? (
                  <a
                    href={project.live_preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-primary transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-text-muted italic">No Demo Link</span>
                )
              ) : isGraphicOrAiTrack ? (
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Asset</span>
                </button>
              ) : (
                <span className="text-xs text-text-muted italic">No Link</span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-navy">
                  {project.vote_count}{" "}
                  <span className="font-normal text-text-muted text-[10px]">votes</span>
                </span>

                <Button
                  variant={hasVotedInCategory ? "light" : "primary"}
                  size="sm"
                  disabled={hasVotedInCategory}
                  leftIcon={
                    hasVotedInCategory ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <ThumbsUp className="w-3.5 h-3.5" />
                    )
                  }
                  onClick={() => onVote(project)}
                >
                  {hasVotedInCategory ? "Voted" : "Vote"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Graphic & AI Prompting Asset Preview Popup Modal */}
      {isAssetModalOpen && (
        <Modal
          isOpen={isAssetModalOpen}
          onClose={() => setIsAssetModalOpen(false)}
          title={project.title}
          description={`${project.registration_code} — ${project.category_name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-1">
            <div className="relative w-full max-h-[60vh] bg-background rounded-2xl border border-border overflow-hidden flex items-center justify-center">
              <img
                src={assetImageUrl}
                alt={project.title}
                className="w-full h-full object-contain max-h-[55vh]"
              />
            </div>

            {project.tagline && (
              <p className="text-xs text-text-secondary leading-relaxed">
                {project.tagline}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
              <span className="text-xs font-mono font-bold text-navy">
                Code: {project.registration_code}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleDownloadAsset}
                >
                  Download Asset
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
