"use client";

import { useState, useEffect } from "react";

const WISHLIST_KEY = "wishlist";

interface WishlistButtonProps {
  productId: string;
}

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

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const items = getWishlistItems();
    if (items.includes(productId)) {
      setWishlisted(true);
    }

    fetch(`/api/wishlist/count?productId=${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch wishlist count");
        return res.json();
      })
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, [productId]);

  const handleToggleWishlist = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const prevWishlisted = wishlisted;
    const prevItems = getWishlistItems();
    const prevCount = count;

    const nextWishlisted = !wishlisted;
    const nextItems = nextWishlisted
      ? [...prevItems, productId]
      : prevItems.filter((id: string) => id !== productId);
    const nextCount = nextWishlisted ? count + 1 : Math.max(0, count - 1);

    setWishlistItems(nextItems);
    setWishlisted(nextWishlisted);
    setCount(nextCount);

    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist");
      const data = await res.json();
      if (data.count !== undefined) setCount(data.count);
    } catch {
      setWishlistItems(prevItems);
      setWishlisted(prevWishlisted);
      setCount(prevCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleToggleWishlist}
        disabled={isLoading}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-transparent text-lg transition-colors ${
          wishlisted ? "border-red-500" : "border-gray-400"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
      <span className="text-sm text-gray-500">
        {count > 0 ? `${count} people wishlisted` : "Be the first to wishlist!"}
      </span>
    </div>
  );
}
