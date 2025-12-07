export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getProduct(id) {
  const res = await fetch(`https://bck2-dtr1.onrender.com/api/products/${id}`, {
    cache: "no-store"
  });
  return res.json();
}

export default async function ProductPage({ params }) {
  const { id } = params;
  const data = await getProduct(id);

  if (!data.success)
    return <div className="p-10 text-white">Product not found</div>;

  const product = data.product;

  return (
    <div className="min-h-screen bg-gray-900 p-10 text-white">
      <div className="max-w-4xl mx-auto bg-white text-black rounded-xl p-8 shadow">

        <img
          src={product.image}
          className="w-full h-96 object-cover rounded mb-6"
        />

        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

        <p className="text-xl text-blue-600 font-bold mb-4">
          ${product.price}
        </p>

        <p className="text-gray-700 whitespace-pre-wrap">
          {product.description}
        </p>
      </div>
    </div>
  );
}
