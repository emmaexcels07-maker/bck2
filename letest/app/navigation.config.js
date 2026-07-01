// navigation.config.js
export const NAV_LINKS = {
  admin: [
    { label: "Overview", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Inventory", path: "/admin/products" },
    { label: "All Orders", path: "/admin/orders" },
  ],
  seller: [
    { label: "My Shop", path: "/seller/dashboard" },
    { label: "My Inventory", path: "/seller/products" },
    { label: "My Orders", path: "/seller/orders" },
  ],
};