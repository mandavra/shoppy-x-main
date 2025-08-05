import { ImagePlus, X } from "lucide-react"

function ImageUploadSection({theImages, 
    onImageChange, 
    removeImage, 
    imageRef, 
    isEditing = false}) {
    return (
        <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Images {theImages.length}/5
      </label>
      <div className="grid grid-cols-5 gap-2 mb-3">
        {theImages.map((img, index) => (
          <div 
            key={index} 
            className="relative group rounded-lg overflow-hidden border border-gray-200"
          >
            <img 
              src={img.preview} 
              alt={`Product preview ${index + 1}`} 
              className="w-full h-20 object-cover" 
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full m-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {theImages.length < 5 && (
          <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-20 cursor-pointer hover:border-indigo-500 transition-colors group">
            <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-indigo-500" />
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onImageChange}
            />
          </label>
        )}
      </div>
    </div>
    )
}

export default ImageUploadSection
