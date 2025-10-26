import { DiscordButton } from "../discord-button";
import { DISCORD_URL } from "@/constants/urls";

export function Navbar() {
  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
      {/* Logo */}
      <a
        href="/"
        className="font-bold text-lg flex items-center"
        aria-label="Kembali ke halaman utama"
      >
        <img
          src="/icon.svg"
          alt="KaburAjaDulu Logo"
          width={140}
          height={28}
          className="w-32 sm:w-40 h-auto"
        />
      </a>

      {/* Navigation Links */}
      <div className="flex items-center">
        <a
          href={DISCORD_URL}
          className="flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gabung dengan komunitas #KaburAjaDulu di Discord"
        >
          <DiscordButton
            variant="outlined"
            className="text-sm sm:text-base px-3 sm:px-4 py-2"
            iconOnly={true}
          />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;

