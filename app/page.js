"use client";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropDown, setDropDown] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      const data = await response.json();
      console.log("Server Response:", data);

      if (!response.ok) {
        throw new Error("Product Not added");
      } else {
        console.log("Product added successfully");
        setAlert("Your Product has been added");
        setProductForm({});
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const onDropdownEdit = async (e) => {
    setQuery(e.target.value);

    if (!loading) {
      setLoading(true);
      setDropDown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropDown(rjson.products);
      setLoading(false);
    }
  };
  return (
    <>
      <Header />
      <div className="container bg-red-50 mx-auto p-4">
        <div className="text-center text-green-700 font-semibold py-2">
          {alert}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Search a Product
        </h1>

        <div className="mb-6 p-5 bg-white shadow-lg rounded-lg flex gap-4">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Search product..."
            className="border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 px-4 py-2 w-full rounded-md"
          />
          <select className="border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 px-4 py-2 rounded-md bg-white">
            <option value="">All</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          </div>
        )}
        <div className="mt-4 space-y-3">
          {dropDown.map((item) => (
            <div
            key={item.slug}
            className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-gray-800 p-4 rounded-lg shadow-md transition-all duration-200 border border-blue-200"
          >
            <span className="font-semibold flex-1">
              {item.slug} ({item.quantity} available for ₹{item.price})
            </span>
            <div className="flex items-center gap-4">
              <button className="add bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded-md transition duration-200 cursor-pointer">
                +
              </button>
              <span className="font-semibold text-lg">{item.quantity}</span>
              <button className="sub bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-md transition duration-200 cursor-pointer">
                -
              </button>
            </div>
          </div>          
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-4">Add a product</h1>
        <form className="mb-4 p-4 bg-white shadow-md">
          <div className="mb-2">
            <label htmlFor="product-slug" className="block font-medium">
              Product Slug
            </label>
            <input
              id="product-slug"
              onChange={handleChange}
              type="text"
              name="slug"
              placeholder="Product Slug"
              value={productForm?.slug || ""}
              className="border px-2 py-1 mr-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="product-quantity" className="block font-medium">
              Quantity
            </label>
            <input
              id="product-quantity"
              onChange={handleChange}
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={productForm?.quantity || ""}
              className="border px-2 py-1 mr-2 w-full"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="product-price" className="block font-medium">
              Price
            </label>
            <input
              id="product-price"
              onChange={handleChange}
              type="number"
              name="price"
              placeholder="Price"
              value={productForm?.price || ""}
              className="border px-2 py-1 mr-2 w-full"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            Add Product
          </button>
        </form>

        <h1 className="text-2xl font-bold mb-4">Display Current Stocks</h1>
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((items) => {
              return (
                <tr className="text-center" key={items.slug}>
                  <td className="border px-4 py-2">{items.slug}</td>
                  <td className="border px-4 py-2">{items.quantity}</td>
                  <td className="border px-4 py-2">₹{items.price}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
