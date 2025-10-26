import { DISCORD_URL } from "@/constants/urls";
import { DiscordButton } from "../discord-button";

export function CTASection() {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto text-center px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-6">
          #KaburAjaDulu, Kalo Bukan Sekarang, Mau Kapan?
        </h2>
        <a
          href={DISCORD_URL}
          className="flex items-center justify-center"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gabung dengan komunitas #KaburAjaDulu di Discord"
        >
          <DiscordButton className="shadow-dc" />
        </a>
      </div>
    </section>
  );
}

export default CTASection;
