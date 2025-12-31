import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Filters {
  category: string;
  gender: string;
  color: string;
  size: string[];
  material: string[];
  brand: string[];
  minPrice: number;
  maxPrice: number;
}

const FilterSidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);

  const categories = ["Shoes", "Sandals"] as const;
  const genders = ["Men", "Women"] as const;

  const colors = [
    "Red", "Blue", "Black", "Gray", "Yellow",
    "Green", "White", "Pink", "Beige", "Navy"
  ] as const;

  const sizes = ["5", "6", "7", "9", "11", "12"] as const;

  const material = [
    "Leather",
    "Synthetic Leather",
    "Mesh Fabric",
    "Rubber Soles",
    "EVA Foam",
    "TPU",
    "Canvas",
    "Suede",
  ] as const;

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Reebok",
    "Vans",
    "Converse",
    "Clarks",
  ] as const;

  // URL params වලින් filters load කරනවා page load වෙලේ හෝ params change වෙලේ
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 100,
    });

    setPriceRange([0, Number(params.maxPrice) || 100]);
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, checked, type } = e.target;

  setFilters(prev => {
    let newFilters = { ...prev };

    if (type === "checkbox") {
      const arrayFields = ["size", "material", "brand"] as const;
      if (arrayFields.includes(name as any)) {
        const current = newFilters[name as "size" | "material" | "brand"];
        newFilters[name as "size" | "material" | "brand"] = checked
          ? [...current, value]
          : current.filter((item: string) => item !== value);
      }
    } else {
      // radio inputs
      newFilters[name as "category" | "gender" | "color"] = value;
    }

    updateURLParams(newFilters);
    return newFilters;
  });
};

  const updateURLParams = (newFilters: Filters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key as keyof Filters];

      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } else if (value && (!Array.isArray(value) || value.length > 0)) {
        params.append(key, String(value));
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    setPriceRange([0, newPrice]);

    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorClick = (color: string) => {
    const newFilters = { ...filters, color: filters.color === color ? "" : color };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Category Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) => (
          <div key={category} className='flex items-center mb-1'>
            <input
              type="radio"
              name='category'
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {genders.map((gender) => (
          <div key={gender} className='flex items-center mb-1'>
            <input
              type="radio"
              name='gender'
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{gender}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Color</label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition 
                hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {/* Size Filters */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Size</label>
        {sizes.map((size) => (
          <div key={size} className='flex items-center mb-1'>
            <input
              type="checkbox"
              name='size'
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{size}</span>
          </div>
        ))}
      </div>

      {/* Material Filters */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Material</label>
        {material.map((mat) => (
          <div key={mat} className='flex items-center mb-1'>
            <input
              type="checkbox"
              name='material'
              value={mat}
              onChange={handleFilterChange}
              checked={filters.material.includes(mat)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{mat}</span>
          </div>
        ))}
      </div>

      {/* Brand Filters */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Brand</label>
        {brands.map((brand) => (
          <div key={brand} className='flex items-center mb-1'>
            <input
              type="checkbox"
              name='brand'
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300'
            />
            <span className='text-gray-700'>{brand}</span>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className='mb-8'>
        <label className='block text-gray-600 font-medium mb-2'>
          Price Range
        </label>
        <input
          type="range"
          min={0}
          max={200}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer'
        />
        <div className='flex justify-between text-gray-600 mt-2'>
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;