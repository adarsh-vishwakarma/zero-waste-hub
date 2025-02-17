import React from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Menu } from "lucide-react";

import Link from "next/link";

import HeaderSearch from "./HeaderSearch";
import { useSession } from "next-auth/react";

const Header = ({ onMenuClick, totalEarnings }) => {
  const { data: session, status, update } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">
                Zero2Hero
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
                ETHOnline24
              </span>
            </div>
          </Link>
        </div>

        <HeaderSearch session={session} status={status}/>
      </div>
    </header>
  );
};

export default Header;
