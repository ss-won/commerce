"use client";

import { useState, useEffect } from "react";
import { Product } from "lib/shopify/types";

const WISHLIST_KEY = "wishlist";

function getWishlistItems(): string[] {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (!saved) return [];
    const items: unknown = JSON.parse(saved);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function setWishlistItems(items: string[]): void {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or localStorage unavailable
  }
}

export default function WishlistButton({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const items = getWishlistItems();
    if (items.includes(product.id)) {
      setWishlisted(true);
    }

    fetch("/api/wishlist/count?productId=" + product.id)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch wishlist count");
        return res.json();
      })
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, [product.id]);

  const toggleWishlist = () => {
    const prevWishlisted = wishlisted;
    const prevItems = getWishlistItems();

    const nextWishlisted = !wishlisted;
    const nextItems = nextWishlisted
      ? [...prevItems, product.id]
      : prevItems.filter((id: string) => id !== product.id);

    setWishlistItems(nextItems);
    setWishlisted(nextWishlisted);

    fetch("/api/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to toggle wishlist");
      })
      .catch(() => {
        setWishlistItems(prevItems);
        setWishlisted(prevWishlisted);
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
