import Link from "next/link";
import { ButtonProps } from "@waitingonalice/design-system/components/button";
import { Text, TextProps } from "@waitingonalice/design-system/components/text";
import { cn } from "@waitingonalice/design-system/utils/cn";

export interface LinkProps
  extends Pick<
    ButtonProps,
    "variant" | "className" | "disabled" | "size" | "children"
  > {
  to: string;
  textSize?: TextProps["type"];
  prefixIcon?: React.ReactNode;
  onClick?: () => void;
}

const LinkComponent = ({
  to,
  children,
  variant = "primaryLink",
  className,
  prefixIcon,
  size,
  textSize = "body",
  onClick,
}: LinkProps) => {
  const handleOnClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    onClick?.();
  };
  const baseStyle =
    "hover:cursor-pointer whitespace-nowrap transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-30 text-[14px] font-medium tracking-[0.0125em] flex justify-center items-center gap-x-4";

  const baseStyleButton = cn(
    "first-letter:focus:outline-none shadow-sm rounded-md active:ring-2 active:ring-offset-1",
    size === "small" ? "px-2 py-1" : "px-4 py-2",
  );

  const variantMapper = {
    primary: cn(
      "shadow-primary-light/40 bg-primary-main hover:bg-primary-dark text-secondary-1 active:bg-primary-light active:ring-primary-light",
      baseStyleButton,
    ),
    secondary: cn(
      "shadow-secondary-1/40 bg-secondary-1 text-primary-main active:ring-primary-light hover:bg-secondary-2",
      baseStyleButton,
    ),
    error: cn(
      "shadow-error-main/40 bg-error-dark text-secondary-1 hover:bg-error-dark/90 active:bg-error-main active:ring-error-main",
      baseStyleButton,
    ),

    primaryLink:
      "hover:text-primary-dark text-primary-main active:text-primary-dark",

    errorLink: "text-error-main hover:text-error-dark active:text-error-dark",
  };

  return (
    <Link
      onClick={handleOnClickLink}
      href={to}
      className={cn(baseStyle, variantMapper[variant], className)}
    >
      {prefixIcon}
      <Text type={textSize}>{children}</Text>
    </Link>
  );
};

export { LinkComponent as Link };
