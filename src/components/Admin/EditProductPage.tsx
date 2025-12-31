import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productSlice';
import axios from 'axios';
import type { AppDispatch, RootState } from '../../redux/store'; // Assume you have these types
import type { Product } from '../../redux/slices/productSlice';


const EditProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);

  const [productData, setProductData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: [],
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProductData((prevData) => ({
        ...prevData,
        images: [...(prevData.images || []), { url: data.imageUrl, altText: "" }],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (id) {
//       dispatch(updateProduct({ id, productData }));
//       navigate("/admin/products");
//     }
//   };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!id) return;

  await dispatch(
    updateProduct({
      id,
      productData: {
        ...productData,
        price: Number(productData.price),
        countInStock: Number(productData.countInStock),
      },
    })
  );

  navigate("/admin/products");
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
      <h2 className='text-3xl font-bold mb-6'>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Product Name</label>
          <input
            type='text'
            name='name'
            value={productData.name || ""}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>

        {/* Description */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Description</label>
          <textarea
            name="description"
            value={productData.description || ""}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Price</label>
          <input
            type='number'
            name='price'
            value={productData.price || 0}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        {/* Count in Stock */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Count in Stock</label>
          <input
            type='number'
            name='countInStock'
            value={productData.countInStock || 0}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        {/* SKU */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>SKU</label>
          <input
            type='text'
            name='sku'
            value={productData.sku || ""}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        {/* Sizes */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
          <input
            type='text'
            name='sizes'
            value={(productData.sizes || []).join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()).filter(Boolean),
              })
            }
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        {/* Colors */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
          <input
            type='text'
            name='colors'
            value={(productData.colors || []).join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()).filter(Boolean),
              })
            }
            className='w-full border border-gray-300 rounded-md p-2'
          />
        </div>

        {/* Image Upload */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Upload Image</label>
          <input type='file' accept='image/*' onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
          <div className='flex gap-4 mt-4 flex-wrap'>
            {(productData.images || []).map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className='w-20 h-20 object-cover rounded-md shadow-md'
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;