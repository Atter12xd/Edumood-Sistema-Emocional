import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Usar authenticate.admin() que es la función correcta
  await authenticate.admin(request);

  return null;
};