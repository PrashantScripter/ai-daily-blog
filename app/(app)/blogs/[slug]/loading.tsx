// app/blogs/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        {/* Meta skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
