import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const compareAt = product.priceRange.maxVariantPrice.compareAtPrice?.amount;
  const hasDiscount = compareAt
    ? parseFloat(minPrice) < parseFloat(compareAt)
    : false;
  const discountPercentage = compareAt
    ? Math.round(
        ((parseFloat(compareAt) - parseFloat(minPrice)) /
          parseFloat(compareAt)) *
          100,
      )
    : 0;

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="flex items-center gap-2">
          <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
              compareAtPrice={compareAt}
            />
          </div>
          {hasDiscount && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              {discountPercentage}% OFF
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
