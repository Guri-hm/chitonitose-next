export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              ちとにとせ
            </h1>
          </div>
          <div className="hidden md:flex md:space-x-8">
            <a href="/geo" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              地理
            </a>
            <a href="/jh" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              日本史
            </a>
            <a href="/wh" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              世界史
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
