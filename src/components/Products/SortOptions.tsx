import React, {type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;
    if (sortBy) {
      searchParams.set("sortBy", sortBy);
    } else {
      searchParams.delete("sortBy");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-6 flex items-center justify-end">
      <label htmlFor="sort" className="mr-3 text-gray-700 font-medium">
        Sort By:
      </label>
      <select
        id="sort"
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );
};

export default SortOptions;