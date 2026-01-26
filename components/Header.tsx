export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              ちとにとせ
            </a>
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
            <a href="/charts" className="text-blue-600 hover:text-blue-800 px-3 py-2">
              📊 グラフ
            </a>
            <a href="/data-test" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm">
              データテスト
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
