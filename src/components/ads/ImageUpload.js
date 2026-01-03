import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import './ImageUpload.css';

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      
      return true;
    });

    setImages([...images, ...validFiles]);
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleReorder = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  return (
    <div className="image-upload">
      <div className="image-upload-grid">
        {images.map((image, index) => (
          <div key={index} className="image-preview">
            {index === 0 && (
              <span className="image-primary-badge">Main</span>
            )}
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
            />
            <div className="image-preview-overlay">
              {index > 0 && (
                <button
                  type="button"
                  className="image-action-btn"
                  onClick={() => handleReorder(index, 0)}
                  title="Set as main image"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              <button
                type="button"
                className="image-action-btn image-remove-btn"
                onClick={() => handleRemoveImage(index)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            className="image-upload-box"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 8v24M8 20h24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p>Add Image</p>
            <span>{images.length}/{maxImages}</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {images.length === 0 && (
        <p className="image-upload-hint">
          Upload at least one image. First image will be the main photo.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
