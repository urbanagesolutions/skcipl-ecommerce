import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ExternalLink, CheckCircle2, Store } from 'lucide-react';
import { CORPORATE_INFO, COMPANY_PLATFORMS } from '@/lib/data';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#17222d] text-gray-300 border-t border-[#263748] pt-14 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Top Corporate Summary Banner */}
        <div className="bg-[#1f2e3d] border border-[#2c4054] rounded-2xl p-6 md:p-8 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">Official Corporate Entity</span>
            <h3 className="text-lg font-bold text-white font-serif">Sabari Krishna Consumables India Pvt Ltd</h3>
            <p className="text-xs text-gray-400">Incorporated under the Ministry of Corporate Affairs, Govt. of India</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs border-y md:border-y-0 md:border-x border-[#2c4054] py-3 md:py-0 md:px-6">
            <div>
              <span className="text-gray-400 block text-[11px]">CIN</span>
              <span className="font-mono font-medium text-white text-[12px]">{CORPORATE_INFO.cin}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">GSTIN</span>
              <span className="font-mono font-medium text-white text-[12px]">{CORPORATE_INFO.gstin}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">FSSAI Central Lic.</span>
              <span className="font-mono font-medium text-emerald-400 text-[12px]">{CORPORATE_INFO.fssai}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Registration City</span>
              <span className="font-medium text-white text-[12px]">Tiruppur, Tamil Nadu</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
            <a
              href="https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20want%20to%20partner%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              <span>Distributor / Partner Connect</span>
              <ExternalLink size={13} />
            </a>
            <Link
              href="/gks-mart"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-lg transition-colors"
            >
              <Store size={14} className="text-emerald-400" />
              <span>Visit GKS Mart (gksmart.in)</span>
            </Link>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: About & Registered Office */}
          <div className="space-y-4">
            <div>
              <span className="text-xl font-bold text-white tracking-tight font-serif">
                Sabari Krishna Consumables
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-gray-400 mt-0.5">
                India Private Limited
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Premier manufacturer of authentic A2 Vedic Bilona Ghee, Wood-Pressed Virgin Oils, and operator of GKS Mart supermarkets and grocery delivery networks.
            </p>
            <div className="space-y-2 text-xs text-gray-300 pt-2 border-t border-[#263748]">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Registered Office:</strong><br />
                  {CORPORATE_INFO.registeredOffice}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-primary shrink-0" />
                <a href={`tel:${CORPORATE_INFO.phone}`} className="hover:text-white transition-colors">
                  {CORPORATE_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary shrink-0" />
                <a href={`mailto:${CORPORATE_INFO.email}`} className="hover:text-white transition-colors">
                  {CORPORATE_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Platforms Ecosystem */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              Platforms Ecosystem
            </h4>
            <ul className="space-y-3">
              {COMPANY_PLATFORMS.map((platform) => (
                <li key={platform.id}>
                  <Link
                    href={platform.url || '/platforms'}
                    className="group flex flex-col p-2 rounded-lg hover:bg-[#1f2e3d] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                        {platform.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2c4054] text-gray-300">
                        {platform.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                      {platform.tagline}
                    </span>
                    {platform.domain && (
                      <span className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {platform.domain}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products & Divisions */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-secondary pl-2.5">
              Products & Divisions
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>A2 Vedic Bilona Cow Ghee</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>Pure Cultured Buffalo Ghee</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>Marachekku Cold-Pressed Oils</span>
                </Link>
              </li>
              <li>
                <Link href="/gks-mart" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>GKS Mart Grocery & FMCG Supermarket</span>
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>Bulk 15L Tins for Sweets & Catering</span>
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>Wild Forest Honey & Traditional Spices</span>
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-secondary" />
                  <span>FSSAI & Agmark Quality Certifications</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Governance & Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              Corporate & Support
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About SKCIPL & Management
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-white transition-colors">
                  Multi-Platform Operations
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-white transition-colors">
                  Institutional & Wholesale Supply
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality Assurance & Lab Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Headquarters & Branch Contacts
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-lg bg-[#1f2e3d] border border-[#2c4054] text-[11px] text-gray-300 space-y-1">
              <span className="font-bold text-white block">Board of Directors:</span>
              <p>• Karuppusamy Dhandapani (MD)</p>
              <p>• Dhandapani Bhuvaneswari (Director)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#263748] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Sabari Krishna Consumables India Private Limited. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>CIN: {CORPORATE_INFO.cin}</span>
            <span>•</span>
            <span>FSSAI: {CORPORATE_INFO.fssai}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">GKS Mart (gksmart.in)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
