import Ecommerce from "@/assets/ECOMMERCE.svg";
import Image from "next/image";
import Search from "@/assets/Search.svg";
import Cart from "@/assets/Cart.svg";
import Left from "@/assets/left.svg"
import Right from "@/assets/right.svg"
import { type StaticImport } from "next/dist/shared/lib/get-img-props";

const Header = () => {
  return (
    <>
      <div className="w-100 h-100 flex flex-col bg-white">
        <div className="w-50 user-info flex flex-row items-center justify-end px-16 text-slate-700">
          <p className="cursor-pointer">Help</p>
          <p className="cursor-pointer">Orders & Returns</p>
          <p className="cursor-pointer">Hi, Jhon</p>
        </div>
        <div className="flex flex-row items-center justify-between px-16 py-3">
          <div>
            <Image src={Ecommerce as StaticImport} alt="e-commerce" />
          </div>
          <div className="product-section flex flex-row font-bold">
            <p className="cursor-pointer">Categories</p>
            <p className="cursor-pointer">Sale</p>
            <p className="cursor-pointer">Clearance</p>
            <p className="cursor-pointer">New stock</p>
            <p className="cursor-pointer">Trending</p>
          </div>
          <div className="product-section flex flex-row">
            <Image src={Search as StaticImport} alt="search" />
            <Image alt="cart" src={Cart as StaticImport} />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center p-1 offers-section">
        <Image alt="left" src={Left as StaticImport} />
        <p className="">Get 10% off on business sign up</p>
        <Image alt="right" src={Right as StaticImport}/>
      </div>
    </>
  );
};
export default Header;
