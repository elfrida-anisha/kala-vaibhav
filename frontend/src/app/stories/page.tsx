'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Quote,
} from 'lucide-react';

export default function CraftStoriesPage() {
  const stories = [
    {
      id: 'kasuti-story',
      craft: 'Kasuti Needlecraft of Karnataka',
      region: 'Dharwad & Hubballi, Karnataka',
      giTag: 'GI Registered (2006)',
      title: 'The Silent Geometry of Chalukyan Needles',
      maker: 'Sunita Devi (18 Years Master Artisan)',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      quote:
        'In Kasuti, no pencil or tracing ever touches the cloth. The eye counts every single warp and weft silk thread. One misplaced thread disrupts the entire temple chariot.',
      body:
        'Dating back to the 6th century Chalukya empire, Kasuti is an extraordinarily complex counted-thread embroidery. Women in northern Karnataka traditionally adorned bridal Ilkal saris with four sacred stitches: Gavanti (double running stitch), Muragi (zigzag), Negi (weaving stitch), and Menthi (cross stitch for architectural gopurams). Because knots are strictly forbidden, both sides of the finished textile look virtually indistinguishable.',
      productsLink: '/explore?category=Textiles+%26+Embroidery',
    },
    {
      id: 'blue-pottery-story',
      craft: 'Jaipur Blue Pottery Glazed Ware',
      region: 'Kot Jeweler & Kukas, Rajasthan',
      giTag: 'GI Registered (2008)',
      title: 'The Clay-Free Alchemy of Mineral Quartz',
      maker: 'Rameshwar Soni (24 Years Master Artisan)',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      quote:
        'People are amazed when they touch our pottery and learn there is no clay inside. It is born from white Aravalli quartz stone and katira tree gum, painted with cobalt mineral oxide.',
      body:
        'Introduced to Jaipur under Sawai Ram Singh II in the 19th century, Jaipur Blue Pottery is globally unique among ceramic traditions: it is created without a single ounce of clay. Instead, quartz stone powder, cullet glass, Fuller\'s earth, and natural gum are hand-rolled into dough, cast into open molds, painted with camel-hair brushes, and low-fired at 800°C for 72 hours.',
      productsLink: '/explore?category=Pottery+%26+Ceramics',
    },
    {
      id: 'channapatna-story',
      craft: 'Channapatna Lacquerware Toys',
      region: 'Gombegala Ooru, Karnataka',
      giTag: 'GI Registered (2005)',
      title: 'Turning Hale Wood with Natural Turmeric Lac',
      maker: 'Manju Gowda (12 Years Craft Turner)',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      quote:
        'Our toys are safe enough for infants to teeth on because every color is food-grade vegetable dye—turmeric for golden yellow, indigo for blue, and katha for warm brown.',
      body:
        'In the historic town of Channapatna (Town of Toys), artisans season the pale softwood of Wrightia tinctoria (Hale Mara) for months before turning it on traditional lathes. Natural resin from the Kerria lacca insect is mixed with non-toxic botanical colors and friction-applied while spinning. The radiant high gloss is burnished naturally with dried screw pine leaves.',
      productsLink: '/explore?category=Toys+%26+Living',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B65F43] uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-[#C5A56A]" />
          <span>Generational Craft Chronicles</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#253451] tracking-tight">
          Craft Journeys & Maker Stories
        </h1>
        <p className="text-sm text-[#5C5853] leading-relaxed">
          Behind every finished piece on Kala Vaibhav lies a family lineage, generational patience, and ancestral
          wisdom passed down through centuries. Discover the cultural heritage of our master artisans.
        </p>
      </div>

      {/* Stories List */}
      <div className="space-y-16">
        {stories.map((st, i) => (
          <div
            key={st.id}
            className="warm-card rounded-3xl overflow-hidden border-2 border-[#E8E2D6] bg-white grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-md"
          >
            {/* Visual Photo Left */}
            <div className={`lg:col-span-5 relative min-h-[300px] lg:min-h-[420px] bg-gray-100 ${i % 2 === 1 ? 'lg:order-last' : ''}`}>
              <img src={st.image} alt={st.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-[#253451]/90 backdrop-blur-sm text-[#FAF7F0] text-xs font-semibold px-3 py-1 rounded-full">
                {st.giTag}
              </div>
            </div>

            {/* Narrative Content Right */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B65F43] uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{st.region}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#253451]">
                  {st.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#5C5853] leading-relaxed">
                  {st.body}
                </p>

                {/* Artisan Quote Box */}
                <div className="bg-[#FAF7F0] border-l-4 border-[#C5A56A] p-4 rounded-r-xl space-y-2">
                  <Quote className="w-5 h-5 text-[#C5A56A]" />
                  <p className="text-xs text-[#253451] italic leading-relaxed font-medium">
                    &quot;{st.quote}&quot;
                  </p>
                  <div className="text-[11px] font-bold text-[#B65F43]">— {st.maker}</div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Authentic GI-Certified Heritage</span>
                <Link
                  href={st.productsLink}
                  className="bg-[#253451] hover:bg-[#B65F43] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Explore {st.craft.split(' ')[0]} Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
