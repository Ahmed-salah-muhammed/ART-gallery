/**
 * Read an image File and return a resized/compressed JPEG data URL.
 * Keeps avatars small enough to store inline in MongoDB (User.profilePhoto).
 */
export function fileToCompressedDataUrl(file, maxSize = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type?.startsWith("image/")) {
      reject(new Error("Please choose an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load the image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
