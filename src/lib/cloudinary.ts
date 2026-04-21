const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo";

type CloudinaryOptions = {
  width?: number;
  height?: number;
  aspectRatio?: string;
  crop?: "fill" | "fit" | "scale" | "thumb";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg";
};

export function cloudinaryUrl(publicId: string, opts: CloudinaryOptions = {}): string {
  if (publicId.startsWith("http")) return publicId;
  if (publicId.startsWith("/")) return publicId;

  const {
    width = 800,
    height,
    aspectRatio,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = opts;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    `w_${width}`,
    height ? `h_${height}` : null,
    aspectRatio ? `ar_${aspectRatio}` : null,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
