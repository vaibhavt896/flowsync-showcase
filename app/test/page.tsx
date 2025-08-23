export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">FlowSync Test Page</h1>
        <p className="text-lg text-gray-600 mb-8">
          If you can see this, the basic Next.js app is working!
        </p>
        <div className="bg-blue-500 text-white px-6 py-3 rounded-lg inline-block">
          Server is running successfully ✅
        </div>
      </div>
    </div>
  )
}