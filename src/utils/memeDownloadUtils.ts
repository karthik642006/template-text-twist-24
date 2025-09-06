import html2canvas from "html2canvas";

export interface DownloadOptions {
  format?: "png" | "jpeg";
  quality?: number;
  filename?: string;
}

export const captureMemeContainer = async (
  options: DownloadOptions = {}
) => {
  const {
    format = "png",
    quality = 1.0,
    filename = `meme-${Date.now()}`,
  } = options;

  // Find meme container
  const memeContainer = document.querySelector(
    "[data-meme-container]"
  ) as HTMLElement;
  if (!memeContainer) {
    throw new Error("Meme container not found");
  }

  // Get the current display size of the container
  const containerRect = memeContainer.getBoundingClientRect();
  const displayWidth = containerRect.width;
  const displayHeight = containerRect.height;

  // Use the actual display size for exact match
  const exportWidth = displayWidth;
  const exportHeight = displayHeight;

  // Screenshot the container with exact dimensions
  const canvas = await html2canvas(memeContainer, {
    backgroundColor: "#ffffff",
    useCORS: true,
    scale: 2, // High quality capture
    width: displayWidth,
    height: displayHeight,
    allowTaint: false,
    ignoreElements: (element) =>
      element.classList.contains("resize-handle") ||
      element.classList.contains("control-handle") ||
      element.hasAttribute("data-placeholder") ||
      element.hasAttribute("data-selection-ring"),
  });

  // --- DOWNLOAD IMAGE WITH EXACT DIMENSIONS ---
  const link = document.createElement("a");
  link.download = `${filename}.${format}`;
  link.href = canvas.toDataURL(`image/${format}`, quality);
  link.click();
};
