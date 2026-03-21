'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { BlogCard } from './BlogCard';
import { translate } from '@/i18n/dictionaries';
import type { CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/constants';

export interface BlogPost {
  id: string;
  category: string;
  date: string;
  imageUrl: string;
  title: string;
  link?: string;
}

interface BlogSectionProps {
  posts: CollectionEntry<'blog'>[];
  locale?: Locale;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, locale = 'id' }) => {
  const t = (key: string) => translate(locale, key);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const allCategories = ['Semua', 'Lowongan', 'Beasiswa', 'Event', 'Kelas Bahasa', 'Berita'];

  const filteredPosts = selectedCategory === 'Semua'
    ? posts
    : posts.filter(post => post.data.category === selectedCategory);

  const handleCardClick = (slug: string) => {
    const blogPath = locale === 'id' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
    if (typeof window !== 'undefined') {
      window.location.href = blogPath;
    }
  };

  return (
    <section className="py-16 px-4" id="blog">
      <div className="w-full max-w-[1040px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <h2 className="text-[24px] md:text-[32px] font-bold text-gray-900 leading-none">
              {t('blog.headline')}
            </h2>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex items-center gap-4 w-max md:w-auto pb-2 md:pb-0">
                {allCategories.map((category, index) => (
                  <React.Fragment key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        'text-[15px] md:text-[17px] text-gray-900 transition-all whitespace-nowrap',
                        selectedCategory === category
                          ? 'font-semibold text-blue-600 border-b-2 border-blue-600'
                          : 'font-normal hover:opacity-70 cursor-pointer'
                      )}
                    >
                      {category}
                    </button>
                    {index < allCategories.length - 1 && (
                      <div className="w-1 h-1 bg-gray-900 opacity-20 rounded-full flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <a
            href={`/${locale === 'id' ? '' : locale + '/'}blog`}
            className="hidden md:block text-[17px] text-gray-900 hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            {t('blog.view_all')}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              category={post.data.category}
              date={post.data.pubDate.toLocaleDateString(locale === 'id' ? 'id-ID' : locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              imageUrl={post.data.image}
              title={post.data.title}
              onClick={() => handleCardClick(post.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
