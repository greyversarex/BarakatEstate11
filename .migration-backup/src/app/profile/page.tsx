import SellerProfilePage from "@/components/SellerProfilePage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Загрузка профиля...</div>}>
      <SellerProfilePage />
    </Suspense>
  );
}
