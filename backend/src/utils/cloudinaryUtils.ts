import { v2 as cloudinary } from 'cloudinary';


// Upload buffer data to Cloudinary
export const uploadToCloudinary = async (
    buffer: Buffer,
    fileName: string,
    resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto',
    folder?: string
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const uploadOptions: any = {
            resource_type: resourceType,
            public_id: fileName,
            use_filename: true,
            unique_filename: false,
        };

        if (folder) {
            uploadOptions.folder = folder;
        }

        // Use upload_stream for buffer data
        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id
                    });
                } else {
                    reject(new Error('Upload failed - no result returned'));
                }
            }
        );


        // MUST wrap in try/catch for Vercel
        try {
            uploadStream.end(buffer);
        } catch (err) {
            reject(err);
        }
    });
};


//Upload PDF buffer to Cloudinary
export const uploadPdfToCloudinary = async (
    buffer: Buffer,
    fileName: string,
    folder?: string
): Promise<{ secure_url: string; public_id: string }> => {
    return uploadToCloudinary(buffer, fileName, 'raw', folder);
};


//Upload document buffer to Cloudinary (CSV, XLSX, DOCX)
export const uploadDocumentToCloudinary = async (
    buffer: Buffer,
    fileName: string,
    folder?: string
): Promise<{ secure_url: string; public_id: string }> => {
    return uploadToCloudinary(buffer, fileName, 'raw', folder);
};



export const extractCloudinaryPublicId = (cloudinaryUrl: string): string | null => {
    try {
        const urlParts = cloudinaryUrl.split('/');

        // Find the index of 'upload' in the URL
        const uploadIndex = urlParts.findIndex(part => part === 'upload');

        if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
            throw new Error('Invalid Cloudinary URL format');
        }

        // Get everything after version (v1234567890) - INCLUDING file extension
        const publicId = urlParts.slice(uploadIndex + 2).join('/');

        return publicId;
    } catch (error) {
        console.error('Error extracting public ID from Cloudinary URL:', error);
        return null;
    }
};


export const deleteFromCloudinary = async (
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<boolean> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        if (result.result === 'ok') {
            return true;
        } else if (result.result === 'not found') {
            // Consider this as success since the file doesn't exist
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('❌ Error deleting file from Cloudinary:', error);
        return false;
    }
};


export const isValidCloudinaryUrl = (url: string): boolean => {
    try {
        return url.includes('cloudinary.com') && url.includes('/upload/');
    } catch (error) {
        return false;
    }
};
