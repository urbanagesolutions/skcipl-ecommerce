import { Suspense } from 'react';
import SearchPage from './SearchContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
