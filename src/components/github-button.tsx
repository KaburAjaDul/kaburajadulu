import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GithubButtonProps {
  className?: string
  onClick?: () => void
  ariaLabel?: string
  children?: React.ReactNode
}

export function GithubButton({
  className,
  onClick,
  ariaLabel = "GitHub Contributor",
  children,
}: GithubButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        "w-[242px] h-[42px] rounded-[16px] gap-2 px-4 py-2",
        "bg-[#111111] hover:bg-[#111111]/90 text-white",
        "shadow-[2px_4px_16px_0px_rgba(0,0,0,0.32)]",
        "font-medium",
        "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <GithubIcon className="w-6 h-6" aria-hidden="true" />
      {children || "GitHub Contributor"}
    </Button>
  )
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_11_461)">
        <path
          d="M12.4985 0.249817C5.873 0.249817 0.5 5.64382 0.5 12.2978C0.5 17.6198 3.938 22.1348 8.708 23.7293C9.308 23.8403 9.527 23.4683 9.527 23.1488C9.527 22.8623 9.5165 22.1048 9.5105 21.0998C6.173 21.8273 5.468 19.4843 5.468 19.4843C4.9235 18.0923 4.136 17.7218 4.136 17.7218C3.0455 16.9748 4.217 16.9898 4.217 16.9898C5.4215 17.0753 6.0545 18.2318 6.0545 18.2318C7.1255 20.0723 8.864 19.5413 9.548 19.2323C9.656 18.4538 9.9665 17.9228 10.31 17.6213C7.646 17.3168 4.844 16.2833 4.844 11.6678C4.844 10.3523 5.312 9.27682 6.08 8.43382C5.9555 8.12932 5.5445 6.90382 6.197 5.24632C6.197 5.24632 7.205 4.92232 9.497 6.48082C10.454 6.21382 11.48 6.08032 12.5015 6.07582C13.52 6.08182 14.5475 6.21382 15.506 6.48232C17.7965 4.92382 18.803 5.24782 18.803 5.24782C19.457 6.90682 19.046 8.13082 18.923 8.43532C19.6925 9.27832 20.156 10.3538 20.156 11.6693C20.156 16.2968 17.351 17.3153 14.678 17.6138C15.1085 17.9858 15.4925 18.7208 15.4925 19.8443C15.4925 21.4553 15.4775 22.7543 15.4775 23.1488C15.4775 23.4713 15.6935 23.8463 16.3025 23.7278C21.065 22.1318 24.5 17.6183 24.5 12.2978C24.5 5.64382 19.127 0.249817 12.4985 0.249817Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_11_461">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}