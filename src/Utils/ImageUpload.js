import axios from 'axios';

// Image upload - Returns full quality image URL
export const imageUpload = async image => {
    const formData = new FormData();
    formData.append('image', image);
    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${'4eb3d1b0b31cca6aad8dec6ca46845c3'}`,
        formData
    );
    // Use 'url' instead of 'display_url' for full quality
    // 'url' = original full-size image
    // 'display_url' = compressed/optimized version
    return data.data.url;
};