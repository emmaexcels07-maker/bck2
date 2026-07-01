export default function ProductSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-4">
      {/* Image Placeholder */}
      <div className="aspect-square bg-gray-200 rounded-xl w-full" />
      
      {/* Content Placeholders */}
      <div className="space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded-md w-3/4" />
        {/* Description/Category */}
        <div className="h-4 bg-gray-200 rounded-md w-1/2" />
      </div>

      {/* Price & Button Placeholder */}
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded-md w-1/4" />
        <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
      </div>
    </div>
  );
}