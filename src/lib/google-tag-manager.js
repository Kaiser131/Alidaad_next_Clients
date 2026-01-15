import { sendGTMEvent } from "@next/third-parties/google";

// ============ Type Definitions ============

/**
 * @typedef {Object} Product
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} brandName
 * @property {string} category
 * @property {string} subMain
 * @property {number} price
 * @property {number} [offerPrice]
 * @property {boolean} hasOffer
 * @property {string} sku
 */

/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {string} name
 * @property {string} [slug]
 * @property {string} brandName
 * @property {number} unitPrice
 * @property {number} quantity
 * @property {Object} variant
 * @property {string} variant.size
 * @property {string} variant.color
 * @property {number} variant.price
 * @property {number} [variant.discountPrice]
 * @property {string} [variant.sku]
 */

/**
 * @typedef {Object} Extra
 * @property {string} event_id
 * @property {string | undefined} userId
 * @property {string | undefined} userName
 * @property {string | undefined} email
 */

/**
 * @typedef {Object} BeginCheckoutPayload
 * @property {string} event_id
 * @property {string} [userId]
 * @property {string} [userName]
 * @property {string} [email]
 * @property {CartItem[]} items
 */

/**
 * @typedef {Object} PurchaseProduct
 * @property {string} productId
 * @property {string} slug
 * @property {string} name
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {number} totalPrice
 * @property {number} [discountApplied]
 * @property {Object} variant
 * @property {string} variant.size
 * @property {string} variant.color
 * @property {number} variant.price
 * @property {number} [variant.discountPrice]
 * @property {string} [variant.sku]
 */

/**
 * @typedef {Object} PurchasePayload
 * @property {string} event_id
 * @property {string} orderId
 * @property {string | undefined} userId
 * @property {string | undefined} userName
 * @property {string | undefined} email
 * @property {number} orderTotal
 * @property {number} totalDiscount
 * @property {PurchaseProduct[]} products
 */

// ============ Event Functions ============

/**
 * @param {Product & Extra} payload
 */
export const viewcontentEvent = (payload) => {
  console.log("sending-payload-for-product-view", payload);
  return sendGTMEvent({
    event: "view_item",
    event_id: payload._id,
    user_data: {
      user_id: payload?.userId,
      name: payload?.userName,
      email: payload?.email,
    },
    ecommerce: {
      currency: "BDT",
      value: payload.offerPrice ?? payload.price,
      items: [
        {
          item_id: payload.slug ?? payload._id,
          item_name: payload.name,
          item_brand: payload.brandName,
          item_category: payload.category,
          item_category2: payload.subMain,
          price: payload.hasOffer ? payload.offerPrice : payload.price,
          sku: payload.sku ?? "N/A",
          quantity: 1,
        },
      ],
    },
  });
};

/**
 * @param {CartItem & Extra} payload
 */
export const addToCartEvent = (payload) => {
  console.log("sending-payload-for-add-to-cart", payload);
  return sendGTMEvent({
    event: "add_to_cart",
    event_id: payload.event_id,
    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },
    ecommerce: {
      currency: "BDT",
      value: payload.unitPrice,
      items: [
        {
          item_id: payload.slug ?? payload.productId,
          item_name: payload.name,
          item_brand: payload.brandName,
          item_variant: `${payload.variant.size} / ${payload.variant.color}`,
          price: payload.unitPrice,
          quantity: payload?.quantity ?? 1,
          description: "alidaad product",
          item_category: "product",
        },
      ],
    },
  });
};

/**
 * @param {BeginCheckoutPayload} payload
 */
export const initiateCheckoutEvent = (payload) => {
  console.log("sending-payload-for-checkout", payload);
  return sendGTMEvent({
    event: "begin_checkout",
    event_id: payload.event_id,
    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },
    ecommerce: {
      currency: "BDT",
      value: payload.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      ),
      items: payload.items,
    },
  });
};

/**
 * @param {PurchasePayload} payload
 */
export const purchaseEvent = (payload) => {
  console.log("sending-payload-for-purchase", payload);
  return sendGTMEvent({
    event: "purchase",
    event_id: payload.event_id,
    user_data: {
      user_id: payload.userId,
      name: payload.userName,
      email: payload.email,
    },
    ecommerce: {
      transaction_id: payload.orderId,
      currency: "BDT",
      value: payload.orderTotal,
      discount: payload.totalDiscount,
      items: payload.products.map((p) => ({
        item_id: p.productId,
        item_name: p.name,
        item_brand: p.slug,
        item_variant: `${p.variant.size} / ${p.variant.color}`,
        price: p.unitPrice,
        quantity: p.quantity,
        item_category: "product",
        ...(p.variant.sku && { item_sku: p.variant.sku }),
      })),
    },
  });
};

/**
 * @param {Object} payload
 * @param {string} payload.event_id
 * @param {string} payload.url
 * @param {string} payload.page_title
 */
export const pageViewEvent = (payload) => {
  return sendGTMEvent({
    event: "page_view",
    event_id: payload.event_id,
    page_location: payload.url,
    page_title: payload.page_title,
  });
};
