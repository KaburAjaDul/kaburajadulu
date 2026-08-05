import { ArrowUpRight } from 'lucide-react';
import { DISCORD_URL, localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';

interface CommunityGatewayProps {
  locale?: Locale;
}

export function CommunityGateway({ locale = 'id' }: CommunityGatewayProps) {
  const isEnglish = locale !== 'id';
  const paths = isEnglish
    ? [
        { title: 'Join a program', body: 'Browse study, sharing, and project sessions before you choose a conversation.', href: localizedPath(locale, '/programs') },
        { title: 'Follow the agenda', body: 'See what is public, what is upcoming, and where to join when an event starts.', href: localizedPath(locale, '/events') },
        { title: 'Become a volunteer', body: 'Understand the cycle, divisions, and intake path before you meet the team.', href: localizedPath(locale, '/volunteer') },
      ]
    : [
        { title: 'Ikut program', body: 'Lihat program belajar, sharing, dan project sebelum memilih percakapan yang tepat.', href: localizedPath(locale, '/programs') },
        { title: 'Lihat agenda', body: 'Temukan kegiatan publik dan gabung lewat Discord saat acaranya dimulai.', href: localizedPath(locale, '/events') },
        { title: 'Jadi volunteer', body: 'Pahami cycle, divisi, dan jalur intake sebelum bertemu tim relawan.', href: localizedPath(locale, '/volunteer') },
      ];

  return (
    <section className="py-12 md:py-16" lang={isEnglish ? 'en' : 'id'} aria-labelledby="community-gateway-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            {isEnglish ? 'Choose your way in' : 'Pilih pintu masukmu'}
          </p>
          <h2 id="community-gateway-heading" className="mt-3 text-3xl font-bold tracking-tight">
            {isEnglish ? 'Come with a question. Leave with a next step.' : 'Datang dengan pertanyaan. Pulang dengan langkah berikutnya.'}
          </h2>
          <p className="mt-3 text-gray-600">
            {isEnglish ? 'The website gives you context. Discord is where you join the community.' : 'Website memberi konteks. Discord adalah tempat kamu benar-benar ikut.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {paths.map((path, index) => (
            <a
              key={path.href}
              href={path.href}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-blue-400 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span className="text-sm font-semibold text-gray-400">0{index + 1}</span>
              <span className="mt-8 flex items-start justify-between gap-4">
                <span>
                  <strong className="block text-lg text-gray-950">{path.title}</strong>
                  <span className="mt-2 block text-sm leading-6 text-gray-600">{path.body}</span>
                </span>
                <ArrowUpRight aria-hidden="true" size={18} className="shrink-0 text-blue-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          {isEnglish ? 'Ready to ask someone directly?' : 'Sudah siap bertanya langsung?'}{' '}
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 underline underline-offset-4">
            {isEnglish ? 'Join KAD on Discord' : 'Gabung ke Discord KAD'}
          </a>
        </p>
      </div>
    </section>
  );
}

export default CommunityGateway;
