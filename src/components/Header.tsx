
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalStyles: number;
}

export function Header({ searchQuery, onSearchChange, totalStyles }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-strong shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              艺术风格画廊
            </h1>
            <p className="text-sm text-white/70 mt-1">
              {totalStyles} 种风格
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="搜索风格..."
                className="w-full px-4 py-2 glass rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
