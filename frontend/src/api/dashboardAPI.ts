import apiCall from "./apiCall";
import type { Category, Project } from "../utils/dataTypes";

/**
 * Stage 3 API: GET /api/categories/
 * Fetches all project exhibition categories from the backend.
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiCall<any[]>({
      url: "categories/",
      method: "GET",
    });
    if (!Array.isArray(data)) return [];
    return data.map((cat) => ({
      ...cat,
      id: String(cat.id),
    }));
  } catch (error) {
    console.warn("fetchCategories API call failed:", error);
    return [];
  }
}

/**
 * Stage 3 API: GET /api/projects/?category=&search=&status=
 * Fetches projects filtered by category, search term, or track.
 */
export async function fetchProjects(params?: {
  category?: string;
  search?: string;
  status?: string;
  track?: string;
}): Promise<Project[]> {
  try {
    const data = await apiCall<any[]>({
      url: "projects/",
      method: "GET",
      params,
    });
    if (!Array.isArray(data)) return [];
    return data.map((proj) => ({
      ...proj,
      id: String(proj.id),
      category_id: String(proj.category_id || proj.category?.id || ""),
      category_name: proj.category_name || proj.category?.name || "General",
    }));
  } catch (error) {
    console.warn("fetchProjects API call failed:", error);
    return [];
  }
}

/**
 * Stage 3 API: GET /api/projects/:id/
 * Retrieves single project details by ID.
 */
export async function fetchProjectById(id: string | number): Promise<Project | null> {
  try {
    const data = await apiCall<any>({
      url: `projects/${id}/`,
      method: "GET",
    });
    if (!data) return null;
    return {
      ...data,
      id: String(data.id),
      category_id: String(data.category_id || data.category?.id || ""),
      category_name: data.category_name || data.category?.name || "General",
    };
  } catch (error) {
    console.warn(`fetchProjectById API call failed for ID ${id}:`, error);
    return null;
  }
}

/**
 * Stage 4 API: POST /api/verify-voter/
 * Validates matriculation number with backend voter database.
 */
export async function verifyVoter(matricNumber: string): Promise<{ valid: boolean; message?: string; error?: string }> {
  try {
    const data = await apiCall<{ valid: boolean; message?: string; error?: string }>({
      url: "verify-voter/",
      method: "POST",
      data: { matric_number: matricNumber },
    });
    return data;
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.message || errData?.error || "Invalid matric number format.";
    return { valid: false, error: errorMsg };
  }
}

/**
 * Stage 4 API: POST /api/votes/
 * Casts a vote for a project with a voter's matric number.
 * Catches 409 Conflict if voter already voted in category.
 */
export async function castVote(
  projectId: string | number,
  matricNumber: string
): Promise<{ success: boolean; message?: string; error?: string; isConflict?: boolean; vote_count?: number }> {
  try {
    const data = await apiCall<{ success: boolean; message?: string; vote_count?: number }>({
      url: "votes/",
      method: "POST",
      data: {
        project_id: projectId,
        matric_number: matricNumber,
      },
    });
    return { ...data, success: data?.success ?? true };
  } catch (error: any) {
    const errData = error.response?.data;
    const isConflict = error.response?.status === 409;
    const errorMsg = errData?.message || errData?.error || "Unable to cast vote.";
    return { success: false, error: errorMsg, isConflict };
  }
}
