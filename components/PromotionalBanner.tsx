import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { fetchActiveBanners } from '@/lib/data';

export async function PromotionalBanner() {
  const banners = await fetchActiveBanners();
  if (!banners.length) return null;

  const banner = banners[0];

  return (
    <section className="bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-elevation-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-title-md font-bold">{banner.title}</h2>
          {banner.subtitle && <p className="text-sm opacity-90">{banner.subtitle}</p>}
          {banner.discount_percent && (
            <span className="inline-block mt-1 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
              {banner.discount_percent}% OFF
            </span>
          )}
        </div>
      </div>
      {banner.link_url && (
        <Link
          href={banner.link_url}
          className="flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full hover:bg-opacity-90 transition-all text-sm"
        >
          Shop Now <ArrowRight size={16} />
        </Link>
      )}
    </section>
  );
}
