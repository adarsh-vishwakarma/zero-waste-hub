"use client";
import React, { use, useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronDown,
  Coins,
  Leaf,
  LogIn,
  Menu,
  Search,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";
import { getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/actions/dbActions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { prisma } from "@/lib/prisma";


const HeaderSearch = ({session, status}) => {

    const router = useRouter();
  
  
    
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const pathname = usePathname();
  const [notifications, setNotifications] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [balance, setBalance] = useState(0);
  
    const getUserInfo = () => {
      if (session?.data) {
        setUserInfo(session.data.user);  // Directly set the user info from session
      }
    };
  
    const handleLogout = () => {
      setLoggedIn(false); // Immediately set loggedIn to false
      signOut({ redirect: true, callbackUrl: "/" }); // Sign out and redirect to homepage
    };
    
  
    useEffect(() => {
      if (status === "authenticated" && session?.user) {
        setUserInfo(session.user);
        setLoggedIn(true);
        setLoading(false);
      }
    }, [status, session]); // ✅ Runs only when session changes
  
    
    useEffect(() => {
      const fetchNotifications = async () => {
        if (session?.user?.email) {
          const user = await getUserByEmail(session.user.email);
          if (user) {
            const unreadNotifications = await getUnreadNotifications(user.id);
            setNotifications(unreadNotifications);
          }
        }
      };
    
      if (userInfo) {
        fetchNotifications();
        const notificationInterval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(notificationInterval);
      }
    }, [userInfo?.email]); // ✅ Depend only on `userInfo.email`
    
  
  
    useEffect(() => {
      const fetchUserBalance = async () => {
        if (userInfo?.email) {
          
          const user = await getUserByEmail(session.user.email);
  
          if (user) {
            const userBalance = await getUserBalance(user.id);
            setBalance(userBalance);
          }
        }
      };
  
      if (userInfo) {
        fetchUserBalance();
      }
    
      const handleBalanceUpdate = (event) => {
        setBalance(event.detail);
      };
    
      window.addEventListener("balanceUpdated", handleBalanceUpdate);
      return () => window.removeEventListener("balanceUpdated", handleBalanceUpdate);
    }, [userInfo]); // ✅ Depend only on `userInfo.email`
    
  
    const handleNotificationClick = async (notificationId) => {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    };
  
  
  return (
    <> {!isMobile && (
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      )}
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2">
            <Search className="h-5 w-5" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{notification.type}</span>
                    <span className="text-sm text-gray-500">{notification.message}</span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No new notifications</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
          <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
          <span className="font-semibold text-sm md:text-base text-gray-800">
            {balance.toFixed(2)}
          </span>
        </div>
        {!loggedIn ? (
          <Button onClick={()=> router.push("/signup")} className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
            Login
            <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex items-center" >
                <User className="h-5 w-5 mr-1" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={getUserInfo}>
                {userInfo ? userInfo.name : "Fetch User Info"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      </>
    
  )
}

export default HeaderSearch