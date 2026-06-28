export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backendUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://barakatestateadmin.vercel.app";

type SellerContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: SellerContext) {
  const { id } = await context.params;
  const response = await fetch(`${backendUrl}/api/sellers/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  const data = await response.json();

  return Response.json(data, { status: response.status });
}
