import ViewItemPage from '@/src/pages/view-item-page';
import { Suspense } from 'react';

export default function ViewItem() {
  return (
    <Suspense>
      <ViewItemPage />
    </Suspense>
  );
}
