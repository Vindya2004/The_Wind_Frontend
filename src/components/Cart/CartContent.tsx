import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import {
  removeFromCart,
  updateCartItemQuantity,
  type Cart,
  type CartItem,
} from "../../redux/slices/cartSlice";

/* ================= TYPES ================= */

interface CartContentProps {
  cart: Cart;
  userId: string | null;
  guestId: string | null;
}

const CartContent: React.FC<CartContentProps> = ({
  cart,
  userId,
  guestId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateQuantity = (
    product: CartItem,
    delta: number
  ) => {
    const newQuantity = product.quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId: product.productId,
          quantity: newQuantity,
          size: product.size,
          color: product.color,
          userId: userId ?? undefined,     
        guestId: guestId ?? undefined,
        })
      );
    }
  };

  const handleRemoveFromCart = (product: CartItem) => {
    dispatch(
      removeFromCart({
        productId: product.productId,
        size: product.size,
        color: product.color,
        userId: userId ?? undefined,    
        guestId: guestId ?? undefined,
      })
    );
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={`${product.productId}-${index}`}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image ?? "/placeholder.png"}
              alt={product.name ?? "Product"}
              className="w-20 h-24 object-cover mr-4 rounded"
            />

            <div>
              <h3>{product.name}</h3>

              {(product.size || product.color) && (
                <p className="text-sm text-gray-500">
                  {product.size && `Size: ${product.size}`}{" "}
                  {product.color && `| Color: ${product.color}`}
                </p>
              )}

              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleUpdateQuantity(product, -1)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>

                <span className="mx-4">{product.quantity}</span>

                <button
                  onClick={() => handleUpdateQuantity(product, 1)}
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <p>$ {(product.price ?? 0).toLocaleString()}</p>
            <button onClick={() => handleRemoveFromCart(product)}>
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;

