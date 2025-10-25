import { DISCORD_URL } from '@/constants/urls'
import { DiscordButton } from '../discord-button'

export function HeroSection() {
  const handleDiscordClick = () => {
    if (typeof window !== 'undefined') {
      window.open(DISCORD_URL, '_blank')
    }
  }

  return (
    <section className="py-10 md:py-24">
      <div className="container mx-auto text-center px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6">
          &quot;Pengen <span className="text-primary">Kabur</span> ke Luar Negeri? Gaskeun!&quot;
        </h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto mb-8">
        Kalau di sini susah maju, mungkin saatnya lihat ke tempat lain. <strong className="font-bold">#KaburAjaDulu</strong> bantu lo cari jalan buat kerja, kuliah, atau sekadar explore dunia. <strong className="font-bold">Job abroad, event keren, komunitas, kelas bahasa, beasiswa, sampe blog penuh tips & trik semua</strong> ada di sini!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <DiscordButton 
            variant="filled" 
            className="shadow-dc w-full sm:w-auto" 
            onClick={handleDiscordClick}
            ariaLabel="Gabung server Discord #KaburAjaDulu"
          />
          <a 
            href="https://discord.com/company" 
            target='_blank'
            className="text-primary hover:underline font-medium mt-2 sm:mt-0"
            aria-label="Pelajari tentang aplikasi Discord"
          >
            Apa itu Discord?
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
