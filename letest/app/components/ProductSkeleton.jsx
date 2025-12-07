export default function ProductSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded mt-4 w-3/4" />
      <div className="h-4 bg-gray-300 rounded mt-2 w-1/2" />
      <div className="h-8 bg-gray-300 rounded mt-4" />
    </div>
  );
}
