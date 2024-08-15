import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "./assets/vecteezy_a-smiling-woman-sits-at-a-table-surrounded-by-fresh-fruit_47784742-removebg-preview.png";

function Home() {
  return (
    <>
      <div className="bg-bg2 m-0 p-5 md:p-16 min-h-screen font-lora overflow-hidden flex justify-center items-center">
        <div className="text-center block md:grid md:grid-cols-2 shadow-md bg-bg rounded-tl-[3rem] rounded-br-[3rem]">
          <div className="col-span-2">
            <h1 className="p-6 md:p-12 font-montserat font-bold text-3xl text-bg2">
              Pantry<span className="text-bg3">Pal</span>
            </h1>
          </div>
          <div className="p-10 md:p-14 pt-2 text-start">
            <div>
              <h1 className="p-4 pl-0 font-montserat font-bold text-2xl">
                Hello,<span className="text-bg1"> Welcome to PantryPal</span>{" "}
              </h1>
              <p className="leading-9 font-medium">
                PantryPal turns your kitchen into a well-organized space with
                effortless meal planning and streamlined grocery shopping.
                Easily track your pantry inventory, discover recipes based on
                what you have, and manage your grocery lists with ease. Get
                reminders for restocking and expiration dates to stay on top of
                your kitchen needs. Transform your kitchen experience with
                PantryPal. Start today and make your pantry work for you!
              </p>
              <div className="flex justify-around md:gap-12 gap-x-6 md:gap-x-0 pt-12">
                <button className="p-2 md:p-4 text-sm rounded-lg bg-btn1 border-2 border-btn2 text-black font-medium">
                  Discover More
                  <i className="fa-solid fa-lightbulb ml-4 text-sm md:text-xl text-bg1"></i>
                </button>
                <Link to="/organize">
                  <button className="p-2 md:p-4 text-sm rounded-lg bg-btn2 text-black font-medium">
                    Let's Organize
                    <i className="fa-solid fa-arrow-right ml-4 text-sm md:text-xl"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <img src={HomeImage} alt="woman with fruits" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
