import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  FileCheck, 
  FlaskConical, 
  Flame, 
  Leaf, 
  ExternalLink
} from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';

export const metadata = {
  title: 'Quality & FSSAI Certifications | Sabari Krishna Consumables India Private Limited',
  description: 'Learn about our FSSAI compliance, lab purity testing, Agmark Grade-A standards, and traditional Bilona processing quality controls.',
};

export default function QualityPage() {
  const qualityPillars = [
    {
      title: 'FSSAI Central Regulatory Compliance',
      desc: 'All products manufactured and marketed under Sabari Krishna Consumables India Private Limited are fully licensed under the Food Safety and Standards Authority of India (FSSAI Lic. No. 12423018000000).',
      icon: ShieldCheck
    },
    {
      title: '100% Traditional Vedic Bilona Churning',
      desc: 'Our Desi Cow Ghee is made solely by curd culturing and bi-directional wooden churning, preserving short and medium-chain fatty acids (SCFA/MCFA) that are destroyed in industrial cream separation.',
      icon: Flame
    },
    {
      title: 'Chekku Wood-Pressed Oils (Cold Processed)',
      desc: 'Pressed in heavy Vaagai timber expellers strictly below 45°C. Zero chemical refining, no bleaching, no degumming with phosphoric acid, and no artificial de-odorizing.',
      icon: Leaf
    },
    {
      title: 'Batch Traceability & CoA Testing',
      desc: 'Every single production batch of Sabari GKS ghee and oils undergoes RM (Reichert-Meissl) value, FFA, and fatty acid profiling in NABL-accredited food testing laboratories.',
      icon: FlaskConical
    }
  ];

  const parameters = [
    { name: 'Reichert-Meissl (RM) Value', standard: 'Min 28.0 (Agmark Grade-A)', result: '29.5 – 32.0 (High Purity)' },
    { name: 'Free Fatty Acids (as Oleic)', standard: 'Max 1.4%', result: '0.28% – 0.45% (Extremely Fresh)' },
    { name: 'Moisture Content', standard: 'Max 0.5%', result: '0.12% (Long Shelf Life)' },
    { name: 'Baudouin Test (for Vanaspati)', standard: 'Negative', result: 'Strictly Negative (100% Pure Dairy)' },
    { name: 'Hexane / Solvent Residues in Oil', standard: 'Nil', result: 'Zero Detected (Cold Wood Pressed)' },
    { name: 'Curcumin in GKS Mart Turmeric', standard: 'Min 2.5%', result: '> 3.8% Natural Curcumin' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#172433] via-[#1f3044] to-[#14202d] text-white py-16 border-b border-[#2d4054]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-amber-300 text-xs font-semibold">
            <Award size={14} />
            <span>FSSAI License No. {CORPORATE_INFO.fssai}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif leading-tight">
            Quality Assurance & Lab Standards
          </h1>
          <p className="text-base text-gray-300 max-w-2xl font-light leading-relaxed">
            At <strong>Sabari Krishna Consumables India Private Limited</strong>, quality is not a department—it is our founding charter. We uphold authentic Indian food purity across all platforms, from Sabari GKS ghee to GKS Mart (<span className="text-emerald-400">gksmart.in</span>) staples.
          </p>
        </div>
      </section>

      {/* Quality Pillars */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {qualityPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-border-subtle p-8 space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold font-serif text-on-surface">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lab Verification Matrix */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Scientific Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
              Laboratory Testing Benchmark Matrix
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Every production batch is tested in accredited food laboratories against FSSAI and Agmark Grade-A criteria.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface text-on-surface font-bold">
                  <th className="py-3 px-4">Testing Parameter</th>
                  <th className="py-3 px-4">Regulatory Standard</th>
                  <th className="py-3 px-4 text-emerald-700">SKCIPL Batch Assay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {parameters.map((param, idx) => (
                  <tr key={idx} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{param.name}</td>
                    <td className="py-3 px-4 text-warm-gray">{param.standard}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>{param.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Direct Lab Inquiries */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="bg-[#1c2a38] text-white rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <FileCheck size={40} className="text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-bold font-serif">
            Request Batch Certificate of Analysis (CoA)
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Commercial institutions, temple devasthanams, and retail distributors can request formal batch lab test reports for any order.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${CORPORATE_INFO.email}?subject=Request%20Certificate%20of%20Analysis%20(CoA)`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-colors"
            >
              <span>Email Quality Desk</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
