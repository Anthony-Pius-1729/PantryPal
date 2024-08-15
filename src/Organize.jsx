import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 } from "uuid";
import { Oval } from "react-loader-spinner";

// FIRESTORE
import { db } from "./config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { storage } from "./config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// IMAGE
import homeImage from "./assets/thanksgiving-8335322.jpg";
// Google text completion provider import:
import { GoogleGenerativeAI } from "@google/generative-ai";

function Organize() {
  const [startDate, setStartDate] = useState("");
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [updating, setUpdating] = useState(null);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const [height, setHeight] = useState(false);
  // New state to control what is displayed
  const [viewMode, setViewMode] = useState("items"); // "items", "recipe", "mealPlan"
  const [clicked, setClicked] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [mealPlan, setMealPlan] = useState("");

  const handleName = (e) => setName(e.target.value);
  const handleQuantity = (e) => setQuantity(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);
  const handleCategory = (e) => setCategory(e.target.value);
  const handleLocation = (e) => setLocation(e.target.value);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    try {
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);
      setImageURL(downloadURL); 
      alert("Image Uploaded Successfully.");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchItems = async () => {
      const itemsCollection = collection(db, "PantryID");
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(itemsList);
    };
    fetchItems();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHeight(true);
    const itemsCollectionRef = collection(db, "PantryID");

    let imageUrl = "";
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      imageUrl = await getDownloadURL(imageRef);
      setImageURL(imageUrl);
    }

    try {
      if (updating) {
        setLoading(true);
        const itemDocRef = doc(db, "PantryID", updating);
        await updateDoc(itemDocRef, {
          name,
          date: startDate ? startDate.toISOString() : "", 
          quantity,
          price,
          category,
          location,
          imageUrl, 
        });

        setList((prevList) =>
          prevList.map((item) =>
            item.id === updating
              ? {
                  id: updating,
                  name,
                  date: startDate ? startDate.toISOString() : "", 
                  quantity,
                  price,
                  category,
                  location,
                  imageUrl, 
                }
              : item
          )
        );
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        setUpdating(null);
      } else {
        const docRef = await addDoc(itemsCollectionRef, {
          name,
          date: startDate ? startDate.toISOString() : "",
          quantity,
          price,
          category,
          location,
          imageUrl, 
        });

        setList((prevList) => [
          ...prevList,
          {
            id: docRef.id,
            name,
            date: startDate ? startDate.toISOString() : "", // Save date as ISO string
            quantity,
            price,
            category,
            location,
            imageUrl, 
          },
        ]);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }

      setName("");
      setStartDate("");
      setQuantity(0);
      setPrice(0);
      setCategory("");
      setLocation("");
      setImageUpload(null); 
      setImageURL(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteItem = async (id) => {
    const pantryDoc = doc(db, "PantryID", id);
    try {
      await deleteDoc(pantryDoc);
      setList((prevList) => prevList.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateItem = (item) => {
    setUpdating(item.id);
    setName(item.name);
    setStartDate(startDate);
    setQuantity(item.quantity);
    setPrice(item.price);
    setCategory(item.category);
    setLocation(item.location);
  };

  // Handlers to change the view
  const handleShowItems = () => {
    setViewMode("items");
    setClicked(!clicked);
  };

  const handleShowRecipe = async () => {
    setLoading(true); // Start loading

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBBgDpoBsoJLeYxUQ8JZTnSHKctCr_3EpU"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Combine the names of all items in the list
      const itemNames = list.map((item) => item.name).join(", ");
      const prompt = `Generate a recipe using the following ingredients: ${itemNames}. DO NOT ask any question but be very friendly and instructional.`;

      const result = await model.generateContent(prompt);

      const responseText = await result.response.text();

      // Remove asterisks from the generated response
      const plainTextResponse = responseText.replace(/\*/g, "");
      setRecipe(plainTextResponse.trim());

      // Ensure the spinner shows for at least 3 seconds
      setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
      }, 3000);
    } catch (error) {
      console.error(
        "Error generating recipe:",
        error.response ? error.response.data : error.message
      );
      setLoading(false); // Stop loading in case of error
    }

    setViewMode("recipe");
    setClicked(true);
  };

  const handleShowMealPlan = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBBgDpoBsoJLeYxUQ8JZTnSHKctCr_3EpU"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Combine the names of all items in the list
      const itemNames = list.map((item) => item.name).join(", ");

      const prompt = `Generate a meal plan using the following ingredients: ${itemNames}. Do not ask questions. Only be very friendly and instructional.`;

      const result = await model.generateContent(prompt);
      const resultText = result.response.text();
      const plainTextResponse = resultText.replace(/\*/g, "");
      setMealPlan(plainTextResponse.trim());

      setTimeout(() => {
        setLoading(false); // Stop loading after 3 seconds
      }, 3000);
    } catch (error) {
      console.error(
        "Error generating mealplan:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
    setViewMode("mealPlan");
    setClicked(true);
  };

  return (
    <>
      <div className="bg-bg2 m-0 p-5 xl:p-16 min-h-screen font-lora overflow-hidden">
        <div className="text-center shadow-lg bg-bg rounded-tl-[3rem] rounded-br-[3rem]">
          <h1 className="p-12 font-montserat font-bold text-3xl text-bg2">
            Pantry<span className="text-bg3">Pal</span>
          </h1>
          <p className="px-4 xl:px-52 mb-8 xl:mb-0 text-lg w-full font-semibold ">
            Adding items to your pantry helps you stay on top of what you have
            at home. Remember to update quantities as you use or buy new items.
            This way, you'll always know what you need to restock!
          </p>
          <div className="block p-4 lg:p-12 xl:flex xl:justify-between w-full min-h-screen xl:gap-10">
            <div className="w-full">
              <h1 className="font-montserat text-2xl font-bold mb-5 text-[#4A4A4A]">
                Time to Stock Up!
              </h1>
              <form>
                <div className="rounded-lg border-2 border-bg3 w-full xl:h-screen 2xl:h-full  p-8 xl:p-11 pb-0 lg:mb-0 mb-16">
                  <div className="p-0 relative z-10 mx-auto my-10 w-full h-60 border-2 rounded-md border-bg3">
                    <img
                      src={imageURL ? imageURL : homeImage}
                      alt="image"
                      className="object-cover w-full h-full rounded-md"
                    />
                    <input
                      type="file"
                      onChange={(e) => setImageUpload(e.target.files[0])}
                      className="absolute z-50 top-[50%] left-[10%] md:top-[50%] md:left-[35%]"
                      required
                    />
                    <button
                      className="absolute text-slate-700 w-48 font-semibold bg-btn2 p-2 z- top-[70%] left-[10%] md:top-[70%] md:left-[35%]"
                      onClick={handleImageUpload}
                    >
                      Upload Image
                    </button>
                  </div>
                  <div className="block md:flex md:justify-center md:gap-x-10">
                    <div>
                      <input
                        type="text"
                        className="p-3 focus:outline-none w-full md:w-52 rounded-md border-teal-700 border-2"
                        placeholder="Enter Item's name"
                        onChange={handleName}
                        value={name}
                        required
                      />
                    </div>
                    <div>
                      <DatePicker
                        className=" p-3 mt-4 md:mt-0 block w-full  focus:outline-none rounded-md border-teal-700 border-2 xl:w-52"
                        placeholderText="Enter Expiry Date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        required
                      />
                    </div>
                  </div>
                  <div className="block md:flex md:justify-center  md:gap-x-10 mt-5">
                    <div>
                      <input
                        type="text"
                        className="p-3 focus:outline-none w-full xl:w-52 rounded-md border-teal-700 border-2"
                        name=""
                        placeholder="Quantity"
                        onChange={handleQuantity}
                        value={quantity}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        className="p-3  mt-4 md:mt-0 focus:outline-none w-full md:w-52 rounded-md border-teal-700 border-2"
                        name=""
                        placeholder="Price"
                        onChange={handlePrice}
                        value={price}
                        required
                      />
                    </div>
                  </div>
                  <div className="block md:flex md:justify-center   md:gap-x-10 mt-5">
                    <div>
                      <select
                        onChange={handleCategory}
                        value={category}
                        className="p-3 focus:outline-none w-full md:w-52 rounded-md border-teal-700 border-2"
                      >
                        <option>Grains</option>
                        <option>Spices</option>
                        <option>Cereals</option>
                        <option>Canned Food</option>
                        <option>Fruits</option>
                        <option>Vegetables</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        className="p-3 mt-4 md:mt-0 focus:outline-none w-full md:w-52 rounded-md border-teal-700 border-2"
                        name=""
                        placeholder="Location e.g Top Shelf"
                        onChange={handleLocation}
                        value={location}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-10 mb-8">
                    <button
                      onClick={handleAddItem}
                      className="p-3 md:p-4 w-full bg-bg3 rounded-lg text-xl font-medium text-gray-200"
                    >
                      {updating ? "Update Item" : "Add Item"}
                      {updating ? (
                        <i className="fa-solid fa-file-pen ml-8"></i>
                      ) : (
                        <i className="fa-solid fa-plus ml-8"></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="hidden xl:block xl:h-screen bg-gray-300 w-1 mt-14"></div>
            <div className="w-full">
              {/* Conditional rendering based on viewMode */}
              {viewMode === "items" && (
                <>
                  <h1 className="font-montserat text-2xl font-bold mb-5 text-[#4A4A4A]">
                    List of Items
                  </h1>
                  <div
                    className={`rounded-lg border-2 border-bg3 w-full h-${
                      list.length > 0 ? "[90vh]" : "screen"
                    } p-4 pb-4 overflow-y-scroll`}
                  >
                    {loading ? (
                      <Oval
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        wrapperStyle={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          width: "100%",
                        }}
                        wrapperClass=""
                      />
                    ) : (
                      <div className="block md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5">
                        {list.length > 0 ? (
                          list?.map((item, index) => (
                            <div key={index}>
                              <div className="border-bg3   border shadow-lg w-full mb-5 md:mb-0 md:w-64 rounded-t-md bg-slate-100">
                                <img
                                  src={item.imageUrl}
                                  className="w-full md:w-72 rounded-t-md rounded-b-xl"
                                  alt="image"
                                />
                                <div className="text-[0.8rem]  h-28 grid grid-cols-3 gap-x-4 p-1 w-full md:w-64">
                                  <div>
                                    <label htmlFor="" className="text-xs ">
                                      Name
                                    </label>
                                    <p className="text-sm font-semibold">
                                      {item.name}
                                    </p>
                                  </div>
                                  <div className="">
                                    <label htmlFor="" className="text-xs">
                                      Expiry Date
                                    </label>
                                    <p className="font-semibold">
                                      {item.date
                                        ? new Date(
                                            item.date
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <label htmlFor="" className="text-xs">
                                      Quantity
                                    </label>
                                    <p className="font-semibold">
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="">
                                    <label htmlFor="" className="text-xs">
                                      Price
                                    </label>
                                    <p className="font-semibold">
                                      ${item.price}
                                    </p>
                                  </div>
                                  <div>
                                    <label htmlFor="" className="text-xs">
                                      Category
                                    </label>
                                    <p className="font-semibold">
                                      {item.category}
                                    </p>
                                  </div>
                                  <div className="">
                                    <label htmlFor="" className="text-xs">
                                      Location
                                    </label>
                                    <p className="font-semibold w-16">
                                      {item.location}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-around font-semibold py-3">
                                  <button
                                    onClick={() => handleUpdateItem(item)}
                                    className="p-2 bg-btn2 rounded-md text-sm w-24 "
                                  >
                                    <i className="fa-solid fa-pen mr-3"></i>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-2 bg-bg2 rounded-md text-sm w-24"
                                  >
                                    <i className="fa-solid fa-trash mr-3"></i>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-center items-center w-full h-screen  col-span-3 ">
                            <p className="font-bold text-3xl">No Item Added</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {viewMode === "recipe" && (
                <div className="rounded-lg border-2 border-bg3 w-full h-[90vh] mt-[3.3rem]  p-4 pb-4 overflow-y-scroll ">
                  {loading ? (
                    <Oval
                      visible={true}
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="oval-loading"
                      wrapperStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                      wrapperClass=""
                    />
                  ) : (
                    <div className="w-full">
                      <p className="font-bold py-4 text-3xl text-center text-[#4A4A4A]">
                        Recipe Here
                      </p>
                      <div className="overflow-y-scroll">
                        <p className="p-4 md:p-8 pt-2 text-center font-medium">
                          {recipe ? recipe : "No recipe generated"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {viewMode === "mealPlan" && (
                <div className="rounded-lg border-2 border-bg3 w-full h-[90vh] mt-[3.3rem] p-4 pb-4 overflow-y-scroll ">
                  {loading ? (
                    <Oval
                      visible={true}
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="oval-loading"
                      wrapperStyle={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                      wrapperClass=""
                    />
                  ) : (
                    <div className=" w-full ">
                      <p className="font-bold py-4 text-3xl text-center text-[#4A4A4A]">
                        Meal Plan
                      </p>
                      <div className="overflow-y-scroll">
                        <p className="p-4 md:p-8 pt-2 text-center font-medium">
                          {mealPlan ? mealPlan : "Cooking"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {list.length > 0 && (
                <div
                  className={`grid grid-cols-2 md:grid-cols-3 gap-x-4 ${
                    clicked ? "12" : "14"
                  } gap-y-5 py-8`}
                >
                  {clicked && viewMode !== "items" ? (
                    <button
                      onClick={handleShowItems}
                      className="p-3 md:p-3  rounded-md bg-bg3 w-full text-sm font-medium text-gray-200"
                    >
                      <i className="fa-solid fa-arrow-left mr-2 md:mr-4 text-sm md:text-lg"></i>
                      Back to Items
                    </button>
                  ) : null}
                  <button
                    onClick={handleShowRecipe}
                    className="p-3 md:p-3 rounded-md bg-bg3 w-full md:w-48 font-medium text-sm md:text-base text-gray-200"
                  >
                    Get Recipe
                    <i className="fa-solid fa-utensils ml-2 text-sm md:ml-4 md:text-lg"></i>
                  </button>

                  <button
                    onClick={handleShowMealPlan}
                    className={` col-span-${
                      clicked ? "2" : "1"
                    } md:col-span-1  ml-2 p-3 md:p-3 text-sm rounded-md bg-bg3 md:w-48 font-medium text-gray-200`}
                  >
                    Plan Meals
                    <i className="fa-solid fa-calendar-days text-sm ml-2 md:ml-4 md:text-lg"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Organize;
