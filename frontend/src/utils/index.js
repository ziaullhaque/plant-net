import axios from "axios";

export const imageUpload = async (ImageData) => {
  const formData = new FormData();
  formData.append("image", ImageData);

  const data = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );
  return data?.data?.data?.display_url;
};

// upload image using cloudinary
// example post endpoint : https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload

export const imageUploadCloudinary = async (ImageData) => {
  console.log(ImageData);
  const formData = new FormData();
  formData.append("file", ImageData);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const data = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    formData
  );
  // return data.data;
  return data.data.secure_url;
};

// save or update user in db
export const saveOrUpdateUser = async (userData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user`,
    userData
  );
  return data;
};
