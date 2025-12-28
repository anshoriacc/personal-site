import { cn } from "@/lib/utils";

type Props = React.SVGProps<SVGSVGElement> & {
  notAnimated?: boolean;
};

export const EqualizerAnimatedIcon = ({
  className,
  notAnimated = false,
  ...props
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("size-6", className)}
      {...props}>
      <rect width="4" height="12" x="1" y="6" fill="currentColor" rx="2" ry="2">
        {!notAnimated && (
          <>
            <animate
              attributeName="y"
              begin="0s"
              dur="0.9s"
              values="6;2;6;10;6"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              begin="0s"
              dur="0.9s"
              values="12;20;12;6;12"
              repeatCount="indefinite"
            />
          </>
        )}
      </rect>
      <rect
        width="4"
        height={notAnimated ? "20" : "12"}
        x="10"
        y={notAnimated ? "2" : "6"}
        fill="currentColor"
        rx="2"
        ry="2">
        {!notAnimated && (
          <>
            <animate
              attributeName="y"
              begin="0.25s"
              dur="0.9s"
              values="6;10;6;2;6"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              begin="0.25s"
              dur="0.9s"
              values="12;6;12;20;12"
              repeatCount="indefinite"
            />
          </>
        )}
      </rect>
      <rect
        width="4"
        height="12"
        x="19"
        y="6"
        fill="currentColor"
        rx="2"
        ry="2">
        {!notAnimated && (
          <>
            <animate
              attributeName="y"
              begin="0.5s"
              dur="0.9s"
              values="6;2;6;10;6"
              repeatCount="indefinite"
            />
            <animate
              attributeName="height"
              begin="0.5s"
              dur="0.9s"
              values="12;20;12;6;12"
              repeatCount="indefinite"
            />
          </>
        )}
      </rect>
    </svg>
  );
};
