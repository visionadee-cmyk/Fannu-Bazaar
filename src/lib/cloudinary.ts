// Cloudinary image upload utility

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'delr0dbsb'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'fannu_bazaar'

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImageToCloudinary(file))
  return Promise.all(uploadPromises)
}
