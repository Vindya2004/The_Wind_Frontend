import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

interface ProductImage {
  url: string;
  altText?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  brand?: string;
  material?: string;
  sizes?: string[];
  colors?: string[];
  images?: ProductImage[];
}

interface ProductDetailsProps {
  productId?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state: RootState) => state.products
  );

  const { user, guestId } = useSelector((state: RootState) => state.auth);

  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const productFetchId = productId ?? id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      // FIXED: Pass string directly, not object
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action: "plus" | "minus") => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 3000,
      });
      return;
    }

    if (!productFetchId) return;

    setIsButtonDisabled(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      ).unwrap();

      toast.success("Product added to cart!", { duration: 2000 });
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  if (!selectedProduct) return null;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {selectedProduct.images?.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText ?? `Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <img
              src={mainImage || selectedProduct.images?.[0]?.url}
              alt={selectedProduct.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-semibold mb-4">{selectedProduct.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              {selectedProduct.discountPrice && (
                <p className="text-2xl text-gray-500 line-through">
                  ${selectedProduct.discountPrice}
                </p>
              )}
              <p className="text-3xl font-bold">${selectedProduct.price}</p>
            </div>

            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

            {/* Color Selection */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Color:</p>
                <div className="flex gap-3">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Size:</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-white hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-medium mb-2">Quantity:</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isButtonDisabled ? "Adding to Cart..." : "ADD TO CART"}
            </button>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <h2 className="text-3xl font-medium text-center mb-10">You May Also Like</h2>
          <ProductGrid products={similarProducts} loading={loading} error={null} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
