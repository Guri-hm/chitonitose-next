export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ちとにとせ. All rights reserved.</p>
          <p className="mt-2">地理・日本史・世界史のまとめサイト</p>
        </div>
      </div>
    </footer>
  );
}
