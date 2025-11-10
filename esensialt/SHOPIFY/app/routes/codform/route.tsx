import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import codform from "./codform";
import { authenticate } from "../../shopify.server";

// Definir interfaces para los tipos
interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// Loader para obtener datos del servidor
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  
  try {
    // Query para obtener toda la información del propietario
    const response = await admin.graphql(`
      query {
        shop {
          id
          name
          email
          billingAddress {
            firstName
            lastName
            phone
            address1
            city
            country
          }
        }
      }
    `);
    
    const data = await response.json();
    const shopInfo = data.data.shop;
    
    return json({
      shop: session.shop,
      owner: {
        firstName: shopInfo.billingAddress?.firstName || "",
        lastName: shopInfo.billingAddress?.lastName || "",
        email: shopInfo.email || "",
        phone: shopInfo.billingAddress?.phone || "",
        shopName: shopInfo.name || session.shop,
        address: shopInfo.billingAddress?.address1 || "",
        city: shopInfo.billingAddress?.city || "",
        country: shopInfo.billingAddress?.country || "",
        shopId: shopInfo.id
      }
    });
    
  } catch (error) {
    console.log("Error obteniendo info del dueño:", error);
    
    return json({
      shop: session.shop,
      owner: null,
      error: "No se pudo obtener información del propietario"
    });
  }
}

// Exportar directamente el componente ConfigWhatsApp
export default codform;