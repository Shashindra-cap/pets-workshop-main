export default function Header() {
  return (
    <header className="bg-blue-700 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">
          <a href="/" className="hover:underline">
            Tailspin Shelter
          </a>
        </h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
