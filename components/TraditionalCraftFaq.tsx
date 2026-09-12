'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Sparkles, 
  Droplets, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'bilona' | 'marachekku';
  question: string;
  tamilSubtitle?: string;
  answer: string;
  keyPoints?: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'bilona-steps',
    category: 'bilona',
    question: 'What is the sacred 5-stage Vedic Bilona method?',
    tamilSubtitle: 'வேத பிலோனா 5-படிமுறை தயாரிப்பு என்ன?',
    answer: 'The Vedic Bilona method is an ancient Shastric culinary discipline recorded in the Charaka Samhita. Unlike commercial factory ghee made from raw cream, authentic Bilona follows 5 patient steps:',
    keyPoints: [
      '1. Boiling: Fresh whole indigenous cow milk is gently brought to a boil in earthenware or heavy-gauge vessels.',
      '2. Curd Fermentation: The warm milk is inoculated with natural culture to convert 100% of the milk into nutrient-rich curd (dahi) overnight.',
      '3. Wooden Churning (Bilona): The whole curd is churned bi-directionally using a wooden pestle (mathani) to separate living cultured butter (makkhan).',
      '4. Slow Clarification: The cultured butter is slowly simmered on low firewood flame below 110°C, precipitating out milk solids without scorching.',
      '5. Straining & Granulation: Golden liquid is strained and naturally cooled to form authentic golden, aromatic, granular (danedaar) ghee.'
    ]
  },
  {
    id: 'bilona-vs-commercial',
    category: 'bilona',
    question: 'How is Vedic Bilona Ghee different from commercial cream-separated ghee?',
    tamilSubtitle: 'தொழிற்சாலை நெய்க்கும் பிலோனா நெய்க்கும் என்ன வித்தியாசம்?',
    answer: 'Most supermarket commercial ghee is manufactured by spinning raw milk through high-speed motor centrifuges to extract raw cream, which is immediately boiled at high temperatures. This skips the vital fermentation step completely. In contrast, Vedic Bilona converts milk into curd first, activating probiotic lactic acid bacteria, yielding high concentrations of natural Butyric Acid (gut nourishment) and fat-soluble vitamins (A, D, E, and K2).',
    keyPoints: [
      'Commercial: Made from raw unfermented cream; lacks lactic-culture enzymes.',
      'Bilona: Made from cultured curd butter; rich in short-chain fatty acids (SCFA) and gut-healing butyrate.',
      'Texture: Bilona naturally crystallizes into aromatic golden granules without synthetic texturizers.'
    ]
  },
  {
    id: 'bilona-milk-ratio',
    category: 'bilona',
    question: 'Why does 1 kilogram of Vedic Bilona Ghee require 25 to 30 liters of whole milk?',
    tamilSubtitle: '1 கிலோ பிலோனா நெய்க்கு 25-30 லிட்டர் பால் ஏன் தேவைப்படுகிறது?',
    answer: 'In the traditional Bilona process, ghee is derived exclusively from the cultured butterfat extracted from whole curd. Indigenous cows yield wholesome milk with 4.5%–5.5% fat. After patient culturing and gentle churning, each liter of milk yields approximately 35 to 40 grams of clarified butterfat. This concentration of raw nourishment is why authentic Bilona ghee is regarded as golden medicine ("Amritam") in Ayurveda.',
    keyPoints: [
      '25 to 30 Liters of whole milk = 1 kg of pure Bilona Ghee.',
      'Zero artificial thickeners, vegetable shortening, or palm olein diluents.',
      'Maximum retention of natural beta-carotene and CLA (Conjugated Linoleic Acid).'
    ]
  },
  {
    id: 'bilona-lactose',
    category: 'bilona',
    question: 'Is Sabari GKS Vedic Bilona Ghee safe for lactose-intolerant individuals?',
    tamilSubtitle: 'லாக்டோஸ் ஒவ்வாமை உள்ளவர்கள் பிலோனா நெய்யை உட்கொள்ளலாமா?',
    answer: 'Yes, almost everyone with lactose intolerance or milk protein sensitivities can safely consume Vedic Bilona Ghee. The overnight lactic fermentation converts milk sugars (lactose) into lactic acid. During the subsequent slow clarification, remaining water evaporates and trace milk proteins (casein and whey) solidify and are filtered out, leaving a pure lipid oil that is virtually 99.9% lactose-free and casein-free.',
    keyPoints: [
      'Natural fermentation breaks down milk sugars prior to churning.',
      'Simmering caramelizes and separates 99.9% of casein and whey proteins.',
      'Gentle on sensitive digestive tracts and suitable for ketogenic, paleo, and Ayurvedic diets.'
    ]
  },
  {
    id: 'marachekku-wood',
    category: 'marachekku',
    question: 'What is "Vaagai Marachekku" and why is the specific wood so important?',
    tamilSubtitle: 'வாகை மரச்செக்கு என்றால் என்ன? அந்த மரத்தின் முக்கியத்துவம் என்ன?',
    answer: 'Vaagai (Albizia lebbeck, known in English as the East Indian Walnut or Siris tree) has been revered in South Indian agricultural science for over two millennia. Traditional expellers use a mortar and pestle sculpted from seasoned Vaagai wood. Unlike modern metal/rotary expellers that heat seeds past 90°C–120°C due to friction, Vaagai wood naturally absorbs friction heat, keeping seed temperatures strictly below 40°C–45°C throughout extraction.',
    keyPoints: [
      'Vaagai wood naturally absorbs heat without transferring thermal shock to the oil.',
      'Prevents oxidation and thermal destruction of heat-sensitive polyunsaturated fatty acids.',
      'Imparts traditional restorative coolness and subtle earthiness to gingelly, groundnut, and coconut oils.'
    ]
  },
  {
    id: 'marachekku-chemicals',
    category: 'marachekku',
    question: 'Are chemical solvents, hexane, or bleaching agents used during extraction?',
    tamilSubtitle: 'எண்ணெய் பிழிவின் போது இரசாயனங்கள் அல்லது பிளீச்சிங் பயன்படுத்தப்படுகிறதா?',
    answer: 'Sabari Krishna Consumables enforces a strict zero-chemical mandate. Modern commercial "refined" oils use petroleum-derived hexane solvent to dissolve out 99% of seed oil, followed by caustic soda neutralization, bleaching clay, and high-heat 240°C steam deodorizing. Our Vaagai Marachekku oils undergo only mechanical cold pressing and natural gravity filtration through unbleached cotton cloths.',
    keyPoints: [
      'Zero petroleum hexane, caustic soda, or phosphoric acid.',
      'Zero artificial anti-foaming agents, mineral oils, or synthetic TBHQ preservatives.',
      'Preserves 100% of the seeds native vitamin E (tocopherols) and plant sterols.'
    ]
  },
  {
    id: 'marachekku-sediment',
    category: 'marachekku',
    question: 'Why does cold-pressed oil look unclarified, cloudy, or have natural sediment?',
    tamilSubtitle: 'மரச்செக்கு எண்ணெயில் இயற்கையான வண்டல் இருப்பது ஏன்?',
    answer: 'Cloudiness and delicate bottom sediment are the authentic hallmarks of genuine wood-pressed oil. Because our oils are never chemically bleached or high-pressure micro-filtered, microscopic seed fibers, natural micro-nutrients, and plant antioxidants settle naturally at the bottom of the bottle. In winter, pure wood-pressed coconut oil also solidifies naturally below 24°C, verifying the total absence of adulterating liquid liquid mineral oils.',
    keyPoints: [
      'Microscopic seed nutrients and natural antioxidant compounds remain intact.',
      'No synthetic chemical clearing agents or artificial color stabilizers are added.',
      'Sediment is edible and demonstrates true artisanal, single-press processing.'
    ]
  },
  {
    id: 'marachekku-cooking',
    category: 'marachekku',
    question: 'Can Marachekku oils be used for everyday high-heat Indian cooking and frying?',
    tamilSubtitle: 'மரச்செக்கு எண்ணெய்களை தினசரி சமையல் மற்றும் பொரித்தலுக்கு பயன்படுத்தலாமா?',
    answer: 'Absolutely. Traditional Indian cooking has relied on wood-pressed groundnut, sesame, and coconut oils for thousands of years. Because the native polyphenols, sesamol (in sesame), and natural tocopherols are not destroyed by industrial refining, these oils demonstrate exceptional oxidative stability with smoke points exceeding 210°C–230°C, ideal for everyday sautéing, deep frying, and tadka tempering.',
    keyPoints: [
      'Wood-Pressed Groundnut Oil: High smoke point (225°C), neutral nutty aroma, perfect for frying and snacks.',
      'Wood-Pressed Gingelly/Sesame Oil: Rich in sesamol; cold-pressed with traditional palm jaggery for authentic South Indian curries and kuzhambu.',
      'Wood-Pressed Coconut Oil: High in medium-chain triglycerides (Lauric acid); stable and deeply aromatic.'
    ]
  }
];

export default function TraditionalCraftFaq() {
  const [activeTab, setActiveTab] = useState<'all' | 'bilona' | 'marachekku'>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'bilona-steps': true,
    'marachekku-wood': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = activeTab === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === activeTab);

  return (
    <section id="traditional-craft-faq" className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-primary text-xs font-bold uppercase tracking-wider">
          <HelpCircle size={14} />
          <span>Heritage Science & Process FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-on-surface tracking-tight">
          Everything You Need to Know About <br />
          <span className="text-primary">Vedic Bilona Ghee</span> & <span className="text-emerald-800">Vaagai Marachekku</span>
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-light">
          Clear, scientifically grounded answers to the most common questions on why our ancient Kongu food processing methodologies protect your health far better than industrial commodities.
        </p>
      </div>

      {/* Quick Visual Comparison Matrix: Industrial vs Ancient Craft */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bilona vs Commercial Card */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/70 to-white p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2.5 text-amber-900 font-serif font-bold text-base sm:text-lg">
              <Flame className="text-primary" size={20} />
              <span>Ghee Processing Comparison</span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Vedic vs Factory
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                <CheckCircle2 size={15} />
                <span>Sabari GKS Vedic Bilona Method</span>
              </div>
              <p className="text-gray-700 text-[11px] leading-relaxed pl-5">
                Whole curd fermented overnight → churned with bi-directional wooden bilona → cultured makkhan clarified on slow wood-fire. Retains living enzymes, butyric acid, and natural golden granulation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-xs">
                <XCircle size={15} className="text-gray-400" />
                <span>Commercial Industrial Ghee</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed pl-5">
                Raw milk centrifuged to separate uncultured cream → flash boiled at industrial high temperatures. Lacks gut-healing fermentation metabolites.
              </p>
            </div>
          </div>
        </div>

        {/* Marachekku vs Refined Card */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2.5 text-emerald-950 font-serif font-bold text-base sm:text-lg">
              <Droplets className="text-emerald-700" size={20} />
              <span>Cooking Oil Comparison</span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              Cold-Pressed vs Refined
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-emerald-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <CheckCircle2 size={15} />
                <span>Sabari GKS Vaagai Marachekku Method</span>
              </div>
              <p className="text-gray-700 text-[11px] leading-relaxed pl-5">
                Aged Siris wood pestle expels seeds below 45°C. Single mechanical pressing followed by natural cotton cloth settling. Zero chemical contact, high natural vitamin E and polyphenols.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-1.5 text-gray-600 font-semibold text-xs">
                <XCircle size={15} className="text-gray-400" />
                <span>Industrial Solvent-Refined Oil</span>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed pl-5">
                Seeds washed with petroleum hexane solvent at 65°C → treated with caustic soda → chemically bleached with clay → high-temperature steam deodorized at 240°C. Stripped of all natural nutrients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface hover:bg-surface-variant text-on-surface border border-border-subtle'
          }`}
        >
          All Questions ({FAQ_ITEMS.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bilona')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'bilona'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-surface hover:bg-surface-variant text-on-surface border border-border-subtle'
          }`}
        >
          <Flame size={14} />
          <span>Vedic Bilona Ghee (4)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marachekku')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'marachekku'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-surface hover:bg-surface-variant text-on-surface border border-border-subtle'
          }`}
        >
          <Droplets size={14} />
          <span>Vaagai Marachekku Oils (4)</span>
        </button>
      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredItems.map((item) => {
          const isOpen = Boolean(openItems[item.id]);
          const isBilona = item.category === 'bilona';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? isBilona 
                    ? 'border-amber-300 bg-white shadow-sm' 
                    : 'border-emerald-300 bg-white shadow-sm'
                  : 'border-border-subtle bg-white hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isBilona
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {isBilona ? 'Vedic Bilona Ghee' : 'Vaagai Marachekku'}
                    </span>
                    {item.tamilSubtitle && (
                      <span className="text-[11px] text-warm-gray font-medium hidden sm:inline">
                        {item.tamilSubtitle}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-serif text-on-surface leading-snug">
                    {item.question}
                  </h3>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen 
                      ? `${isBilona ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'} rotate-180` 
                      : 'bg-surface text-warm-gray'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border-subtle/60 text-xs sm:text-sm text-on-surface-variant space-y-3 leading-relaxed">
                  <p>{item.answer}</p>
                  
                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-surface/80 border border-border-subtle space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface block">
                        Key Process Distinction:
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {item.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust & Scientific Guarantee Footer Card */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-[#2d4054]">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold">
            <ShieldCheck size={16} />
            <span>FSSAI Central License & Agmark Grade-A Testing</span>
          </div>
          <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
            Have specialized questions regarding custom oil blends or wholesale Bilona supply?
          </h4>
          <p className="text-xs text-gray-300 max-w-xl font-light">
            Our food technology team and master churners in Tiruppur are ready to provide technical batch documentation and laboratory verification.
          </p>
        </div>

        <a
          href="https://wa.me/919443254924?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20have%20questions%20regarding%20the%20Vedic%20Bilona%20and%20Marachekku%20processes."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs flex-shrink-0 transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Sparkles size={16} />
          <span>Consult Process Experts</span>
        </a>
      </div>
    </section>
  );
}
