import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
  compareAtPrice,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  compareAtPrice?: string;
} & React.ComponentProps<"p">) => {
  const formattedPrice = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));

  const formattedCompareAt = compareAtPrice
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).format(parseFloat(compareAtPrice))
    : null;

  return (
    <p suppressHydrationWarning={true} className={className}>
      {compareAtPrice && (
        <span className="mr-2 line-through opacity-50">
          {formattedCompareAt}
        </span>
      )}
      {formattedPrice}
      <span
        className={clsx("ml-1 inline", currencyCodeClassName)}
      >{`${currencyCode}`}</span>
    </p>
  );
};

export default Price;
