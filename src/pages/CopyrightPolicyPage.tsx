import React from 'react';
import { SeoHead } from '../components/common/SeoHead';

export const CopyrightPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-xs leading-relaxed">
      <SeoHead
        title="Copyright Policy"
        description="ReadTriangle Copyright Policy regarding intellectual property rights and user content."
        canonicalUrl="https://readtriangle.com/copyright-policy"
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Copyright Policy</h1>
        <p className="text-slate-500">Effective Date: August 27, 2026 | ReadTriangle Platform</p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Intellectual Property Rights</h3>
          <p>
            ReadTriangle respects intellectual property rights. Users must ensure that they have authorization to convert and listen to uploaded materials.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Prohibited Uses</h3>
          <p>
            Users may not use ReadTriangle to process copyrighted materials without necessary ownership, license, or statutory permission.
          </p>
        </section>
      </div>
    </div>
  );
};
