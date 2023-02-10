import { useState } from "react";
import { ImSearch } from "react-icons/im";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  return (
    <div className="flex justify-center md:justify-start">
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <ImSearch className="text-rose-700" />
        </span>
        <input
          className="placeholder:italic placeholder:text-slate-500 block bg-white dark:bg-zinc-300 w-full border border-slate-300 rounded-md dark:text-black py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Search for anything..."
          type="text"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </label>
    </div>
  );
}
