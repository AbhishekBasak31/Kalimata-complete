import { useParams } from "react-router-dom";
import { subcategories } from "@/data/subcategory";

export default function SubCategoryPage() {
  const { id } = useParams();
  const filteredSubs = subcategories.filter(
    (sub) => sub.categoryId === id
  );

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Subcategories under {id?.replace("-", " ")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSubs.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
          >
            <img
              src={sub.image}
              alt={sub.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">{sub.name}</h3>
              <p className="text-gray-700 text-sm">{sub.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
