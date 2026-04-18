import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      {/* ---------   Left  -------------- */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-20" src={assets.kh1} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
            dignissimos natus eum at consequuntur rem ullam amet sit temporibus,
            ipsam sint, ipsa eveniet ipsum saepe deserunt fugiat facere
            necessitatibus ea?
          </p>
        </div>
        {/* ---------   Middle  -------------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>{" "}
        {/* ---------   Right  -------------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            {" "}
            <li>+1-214-112-234</li>
            <li>kishorehospitals@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/* -------- Copy Right Text ------- */}
        <hr />

        <p className="py-5 text-sm text-center">
          {" "}
          Copyright 2026@ KishoreHospitals - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
