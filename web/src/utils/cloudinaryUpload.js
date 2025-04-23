export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
  );

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url; // מחזיר את ה-URL
    } else {
      throw new Error("העלאה ל-Cloudinary נכשלה");
    }
  } catch (error) {
    console.error("❌ שגיאה בהעלאה ל-Cloudinary:", error);
    throw error;
  }
};
