import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';
import type { AppDispatch, RootState } from '../redux/store'; // Adjust path if needed

const CollectionPage: React.FC = () => {
  const { collection } = useParams<{ collection: string }>();
  const [searchParams] = useSearchParams(); // Correct: returns [searchParams, setSearchParams]
  const dispatch = useDispatch<AppDispatch>();

  // Correct selector: products array from state
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Build query params object from URL search params
  const queryParams = Object.fromEntries(searchParams.entries());

  // Fetch products whenever collection or filters change
  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        collection: collection || undefined, // optional in thunk
        ...queryParams,
      })
    );
  }, [dispatch, collection, searchParams]);

  // Close sidebar when clicking outside (mobile only)
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition"
        aria-label="Open filters"
      >
        <FaFilter />
        Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:w-64 lg:block
        `}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-6">Filters</h3>
          <FilterSidebar />
        </div>
      </div>

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-grow p-6 lg:p-8">
        <h2 className="text-3xl font-bold uppercase mb-6">
          {collection ? `${collection} Collection` : 'All Products'}
        </h2>

        {/* Sort Options */}
        <div className="mb-8">
          <SortOptions />
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;