import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
}

export function Card({ as: Tag = "div", className, children, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-1",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
