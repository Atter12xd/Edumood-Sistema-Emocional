import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import CodForm from "./codform/codform";

export function loader(_: LoaderFunctionArgs) {
  return json({
    shop: "local-preview.myshopify.com",
    owner: {
      firstName: "Demo",
      lastName: "Owner",
      email: "demo-owner@example.com",
      phone: "+51999999999",
      shopName: "Local Preview Store",
      address: "Av. Siempre Viva 742",
      city: "Lima",
      country: "PE",
      shopId: "local-preview-shop-id",
    },
  });
}

export default CodForm;


