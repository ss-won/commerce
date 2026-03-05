import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

function formatDiscount(originalPrice: string, discountedPrice: string) {
  const original = parseFloat(originalPrice);
  const discounted = parseFloat(discountedPrice);
  const percentage = Math.round(((original - discounted) / original) * 100);
  return percentage > 0 ? `${percentage}% OFF` : null;
}

export function ProductDescription({ product }: { product: Product }) {
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const hasDiscount = parseFloat(minPrice) < parseFloat(maxPrice);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="flex items-center gap-2">
          <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          {hasDiscount && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              {formatDiscount(maxPrice, minPrice)}
            </span>
          )}
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
