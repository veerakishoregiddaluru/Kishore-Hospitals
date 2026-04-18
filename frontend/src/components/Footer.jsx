import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">
          {/* LEFT */}
          <div>
            <img className="mb-5 w-24" src={assets.kh1} alt="" />
            <p className="text-gray-600 leading-6 max-w-md">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
              dignissimos natus eum at consequuntur rem ullam amet sit
              temporibus, ipsam sint, ipsa eveniet ipsum saepe deserunt fugiat
              facere necessitatibus ea?
            </p>
          </div>

          {/* MIDDLE */}
          <div>
            <p className="text-lg font-semibold mb-4 text-gray-800">Company</p>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="hover:text-primary cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                About us
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                Contact us
              </li>
              <li className="hover:text-primary cursor-pointer transition">
                Privacy policy
              </li>
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <p className="text-lg font-semibold mb-4 text-gray-800">
              Get in Touch
            </p>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="hover:text-primary transition">+1-214-112-234</li>
              <li className="hover:text-primary transition break-all">
                kishorehospitals@gmail.com
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 border-t pt-6">
          <p className="text-center text-gray-500 text-sm">
            © 2026 KishoreHospitals. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
