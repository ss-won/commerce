"use client";

import { useState, useEffect } from "react";

// Wishlist button component for product pages
export default function WishlistButton({ product }: { product: any }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check localStorage for wishlist state
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      const items = JSON.parse(saved);
      if (items.includes(product.id)) {
        setWishlisted(true);
      }
    }
    // Fetch wishlist count from API
    fetch("/api/wishlist/count?productId=" + product.id)
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  const toggleWishlist = () => {
    const saved = localStorage.getItem("wishlist");
    let items: string[] = saved ? JSON.parse(saved) : [];

    if (wishlisted) {
      items = items.filter((id: any) => id !== product.id);
    } else {
      items.push(product.id);
    }

    localStorage.setItem("wishlist", JSON.stringify(items));
    setWishlisted(!wishlisted);

    // Update count on server
    fetch("/api/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "12px",
      }}
    >
      <button
        onClick={toggleWishlist}
        style={{
          background: "none",
          border: wishlisted ? "2px solid red" : "2px solid gray",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
      <span style={{ fontSize: "14px", color: "#666" }}>
        {count > 0 ? count + " people wishlisted" : "Be the first to wishlist!"}
      </span>
    </div>
  );
}
