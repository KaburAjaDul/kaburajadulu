import { Button } from "@/components/ui/button"

interface DiscordButtonProps {
  variant?: "filled" | "outlined" | "outlined-no-icon" | "filled-no-icon"
  className?: string
  onClick?: () => void
  ariaLabel?: string
  iconOnly?: boolean
}

export function DiscordButton({
  variant = "filled",
  className,
  onClick,
  ariaLabel = "Join our Discord server",
  iconOnly = false,
}: DiscordButtonProps) {
  const baseClasses =
    "h-10 rounded-full text-[14px] font-medium cursor-pointer"

  // Responsive icon classes based on iconOnly prop
  const iconClasses = iconOnly
    ? "m-0 sm:mr-2 sm:-ml-1" // Icon-only on mobile
    : "mr-2 -ml-1" // Always show with text

  // Text visibility classes based on iconOnly prop
  const textClasses = iconOnly ? "hidden sm:inline" : ""

  // Different button variants based on the image
  switch (variant) {
    case "outlined":
      return (
        <Button
          variant="outline"
          className={`${baseClasses} border-2 border-primary text-primary hover:bg-primary/10 ${
            iconOnly ? "px-3 sm:px-5 flex items-center justify-center" : "px-5"
          } ${className}`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <DiscordIconBlue
            className={`w-6 h-6 ${iconClasses}`}
            aria-hidden="true"
          />
          <span className={textClasses}>Join our Discord server</span>
        </Button>
      )
    case "outlined-no-icon":
      return (
        <Button
          variant="outline"
          className={`${baseClasses} border-2 border-primary text-primary hover:bg-primary/10 ${className}`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <span className="hidden sm:inline">Join our Discord server</span>
        </Button>
      )
    case "filled-no-icon":
      return (
        <Button
          variant="default"
          className={`${baseClasses} bg-primary hover:bg-primary/90 ${className}`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <span className="hidden sm:inline">Join our Discord server</span>
        </Button>
      )
    case "filled":
    default:
      return (
        <Button
          variant="default"
          className={`${baseClasses} bg-primary hover:bg-primary/90 ${
            iconOnly ? "px-3 sm:px-5 flex items-center justify-center" : "px-5"
          } ${className}`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <DiscordIconWhite
            className={`w-6 h-6 ${iconClasses}`}
            aria-hidden="true"
          />
          <span className={textClasses}>Join our Discord server</span>
        </Button>
      )
  }
}

function DiscordIconWhite({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1_27)">
        <path
          d="M10.6828 12.6591C10.6828 13.6228 9.99233 14.407 9.12421 14.407C8.26968 14.407 7.56561 13.6228 7.56561 12.6591C7.56561 11.6958 8.25608 10.9111 9.12421 10.9111C9.99889 10.9111 10.6964 11.7028 10.6828 12.6591Z"
          fill="white"
        />
        <path
          d="M16.4452 12.6591C16.4452 13.6228 15.7617 14.407 14.8866 14.407C14.032 14.407 13.328 13.6228 13.328 12.6591C13.328 11.6958 14.0184 10.9111 14.8866 10.9111C15.7617 10.9111 16.4588 11.7028 16.4452 12.6591Z"
          fill="white"
        />
        <path
          d="M12 0C5.37281 0 0 5.37281 0 12C0 18.6272 5.37281 24 12 24C18.6272 24 24 18.6272 24 12C24 5.37281 18.6272 0 12 0ZM20.5739 16.418C19.0908 17.5073 17.6536 18.1688 16.2366 18.607C16.2141 18.6141 16.1897 18.6056 16.1756 18.5864C15.8484 18.1308 15.5513 17.6503 15.2906 17.1459C15.2756 17.1164 15.2892 17.0808 15.3202 17.0691C15.7922 16.8905 16.2413 16.6772 16.6734 16.425C16.7077 16.4048 16.7095 16.3561 16.6781 16.3327C16.5867 16.2647 16.4958 16.193 16.4091 16.1213C16.3927 16.1081 16.3706 16.1053 16.3523 16.1142C13.5473 17.4103 10.4747 17.4103 7.63641 16.1142C7.61812 16.1062 7.59609 16.1091 7.58063 16.1222C7.49391 16.1934 7.40297 16.2647 7.31203 16.3327C7.28063 16.3561 7.28297 16.4048 7.31719 16.425C7.74938 16.6725 8.19844 16.8905 8.67 17.0695C8.70094 17.0812 8.71547 17.1164 8.7 17.1459C8.44547 17.6513 8.14781 18.1313 7.81453 18.5869C7.8 18.6056 7.77609 18.6141 7.75359 18.607C6.34313 18.1688 4.90641 17.5073 3.42281 16.418C3.41062 16.4081 3.40172 16.3931 3.40031 16.3772C3.09844 13.1414 3.71438 9.86531 5.9625 6.50625C5.96812 6.49734 5.97609 6.49031 5.98594 6.48656C7.09172 5.97844 8.27719 5.60484 9.51562 5.39156C9.53813 5.38828 9.56063 5.39859 9.57234 5.41828C9.72563 5.68969 9.90047 6.03703 10.0191 6.32109C11.3245 6.12188 12.6506 6.12188 13.9838 6.32109C14.1019 6.04313 14.2706 5.68969 14.423 5.41828C14.4347 5.39766 14.4572 5.38734 14.4797 5.39156C15.7191 5.60531 16.9045 5.97938 18.0098 6.48656C18.0197 6.49031 18.0277 6.49734 18.0323 6.50719C19.9908 9.38766 20.9583 12.637 20.5964 16.3781C20.595 16.3941 20.587 16.4081 20.5739 16.418Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_27">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function DiscordIconBlue({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1_36)">
        <path
          d="M10.6828 12.6591C10.6828 13.6228 9.99233 14.407 9.12421 14.407C8.26968 14.407 7.56561 13.6228 7.56561 12.6591C7.56561 11.6958 8.25608 10.9111 9.12421 10.9111C9.99889 10.9111 10.6964 11.7028 10.6828 12.6591Z"
          fill="#0055FF"
        />
        <path
          d="M16.4452 12.6591C16.4452 13.6228 15.7617 14.407 14.8866 14.407C14.032 14.407 13.328 13.6228 13.328 12.6591C13.328 11.6958 14.0184 10.9111 14.8866 10.9111C15.7617 10.9111 16.4588 11.7028 16.4452 12.6591Z"
          fill="#0055FF"
        />
        <path
          d="M12 0C5.37281 0 0 5.37281 0 12C0 18.6272 5.37281 24 12 24C18.6272 24 24 18.6272 24 12C24 5.37281 18.6272 0 12 0ZM20.5739 16.418C19.0908 17.5073 17.6536 18.1688 16.2366 18.607C16.2141 18.6141 16.1897 18.6056 16.1756 18.5864C15.8484 18.1308 15.5513 17.6503 15.2906 17.1459C15.2756 17.1164 15.2892 17.0808 15.3202 17.0691C15.7922 16.8905 16.2413 16.6772 16.6734 16.425C16.7077 16.4048 16.7095 16.3561 16.6781 16.3327C16.5867 16.2647 16.4958 16.193 16.4091 16.1213C16.3927 16.1081 16.3706 16.1053 16.3523 16.1142C13.5473 17.4103 10.4747 17.4103 7.63641 16.1142C7.61812 16.1062 7.59609 16.1091 7.58063 16.1222C7.49391 16.1934 7.40297 16.2647 7.31203 16.3327C7.28063 16.3561 7.28297 16.4048 7.31719 16.425C7.74938 16.6725 8.19844 16.8905 8.67 17.0695C8.70094 17.0812 8.71547 17.1164 8.7 17.1459C8.44547 17.6513 8.14781 18.1313 7.81453 18.5869C7.8 18.6056 7.77609 18.6141 7.75359 18.607C6.34313 18.1688 4.90641 17.5073 3.42281 16.418C3.41062 16.4081 3.40172 16.3931 3.40031 16.3772C3.09844 13.1414 3.71438 9.86531 5.9625 6.50625C5.96812 6.49734 5.97609 6.49031 5.98594 6.48656C7.09172 5.97844 8.27719 5.60484 9.51562 5.39156C9.53813 5.38828 9.56063 5.39859 9.57234 5.41828C9.72563 5.68969 9.90047 6.03703 10.0191 6.32109C11.3245 6.12188 12.6506 6.12188 13.9838 6.32109C14.1019 6.04313 14.2706 5.68969 14.423 5.41828C14.4347 5.39766 14.4572 5.38734 14.4797 5.39156C15.7191 5.60531 16.9045 5.97938 18.0098 6.48656C18.0197 6.49031 18.0277 6.49031 18.0323 6.50719C19.9908 9.38766 20.9583 12.637 20.5964 16.3781C20.595 16.3941 20.587 16.4081 20.5739 16.418Z"
          fill="#0055FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_36">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}