import apiCall from "./apiCall";
import type { Project } from "../utils/dataTypes";
import { fetchCategories } from "./dashboardAPI";

export { fetchCategories };

/**
 * Stage 5 API: POST /api/register-project/
 * Registers a new project entry and returns registration code & full metadata.
 */
export async function registerProject(projectData: Record<string, any>): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const data = await apiCall<any>({
      url: "register-project/",
      method: "POST",
      data: projectData,
    });
    const formatted: Project = {
      ...data,
      id: String(data.id),
      category_id: String(data.category_id || data.category?.id || ""),
      category_name: data.category_name || data.category?.name || "General",
    };
    return { success: true, data: formatted };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = typeof errData === "object" ? JSON.stringify(errData) : (errData || "Failed to register project");
    return { success: false, error: errorMsg };
  }
}

/**
 * Stage 5 API: GET /api/lookup-project/?code=&email=
 * Looks up an entrant team's project details and registration status.
 */
export async function lookupProject(code: string, email: string): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const data = await apiCall<any>({
      url: "lookup-project/",
      method: "GET",
      params: { code, email },
    });
    const formatted: Project = {
      ...data,
      id: String(data.id),
      category_id: String(data.category_id || data.category?.id || ""),
      category_name: data.category_name || data.category?.name || "General",
    };
    return { success: true, data: formatted };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "No project found matching the provided code and email.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Stage 5 Update API: PATCH /api/projects/:id/update/
 * Updates an entrant team's project details using validation credentials.
 */
export async function updateProject(
  id: string,
  projectData: Record<string, any>,
  code: string,
  email: string
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const data = await apiCall<any>({
      url: `projects/${id}/update/`,
      method: "PATCH",
      params: {
        code,
        email,
      },
      data: projectData,
    });
    const formatted: Project = {
      ...data,
      id: String(data.id),
      category_id: String(data.category_id || data.category?.id || ""),
      category_name: data.category_name || data.category?.name || "General",
    };
    return { success: true, data: formatted };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = typeof errData === "object" ? JSON.stringify(errData) : (errData || "Failed to update project");
    return { success: false, error: errorMsg };
  }
}

/**
 * Stage 5 Upload API: POST /api/upload-image/
 * Uploads an image file to Cloudinary (or local storage fallback).
 * Returns { url: "https://..." }
 */
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const data = await apiCall<{ url: string }>({
      url: "upload-image/",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, url: data.url };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "Failed to upload image.";
    return { success: false, error: errorMsg };
  }
}
