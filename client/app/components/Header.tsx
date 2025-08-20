"use client";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import Image from "next/image";
import avatar from "../../public/assests/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogOutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./Loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [isClient, setIsClient] = useState(false);
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: session } = useSession();
  const { token, user } = useSelector((state: RootState) => state.auth);

  // ✅ fetch user when either session exists OR Redux auth token exists
  const {
    data: userData,
    isLoading,
    refetch,
  } = useLoadUserQuery(undefined, {
    skip: false,
  });

  const [socialAuth] = useSocialAuthMutation();
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, { skip: !logout });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ handle authentication state changes
  useEffect(() => {
    if (userData) {
      console.log("User is logged in:", userData);
    }

    if (session && !userData) {
      if (session.user?.email) {
        socialAuth({
          email: session.user.email,
          name: session.user.name,
          avatar: session.user.image,
        })
          .unwrap()
          .then(() => {
            toast.success("Login Successful");
          })
          .catch(() => toast.error("Login Failed"));
      }
    }

    if (!session && !userData && !isLoading) {
      setLogout(true);
    }
  }, [session, userData, isLoading, socialAuth]);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget.id === "screen") setOpenSidebar(false);
  };

  // Helper function to safely get user avatar
  const getUserAvatar = () => {
    if (userData?.user?.avatar?.url) {
      return userData.user.avatar.url;
    }
    if (user && typeof user === "object" && user !== null) {
      const userObj = user as any;
      return userObj.avatar?.url || avatar;
    }
    return avatar;
  };

  if (!isClient) return <Loader />;

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <Link
              href="/"
              className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
            >
              E-Learning
            </Link>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />

              {/* mobile menu */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>

              {isClient && userData?.user ? (
                <Link href="/profile">
                  <Image
                    src={getUserAvatar()}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => {
                    setOpen(true);
                    setRoute("Login");
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0 flex flex-col justify-between">
              <div>
                <NavItems activeItem={activeItem} isMobile={true} />

                {isClient && userData?.user ? (
                  <Link href="/profile">
                    <Image
                      src={getUserAvatar()}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-[40px] h-[40px] rounded-full ml-[20px] mt-4 cursor-pointer"
                      style={{
                        border:
                          activeItem === 5 ? "2px solid #37a39a" : "none",
                      }}
                    />
                  </Link>
                ) : (
                  <div className="ml-5 mt-4">
                    <button
                      onClick={() => {
                        setOpen(true);
                        setRoute("Login");
                        setOpenSidebar(false); // close sidebar when modal opens
                      }}
                      className="px-4 py-2 bg-[#37a39a] text-white rounded-lg shadow hover:bg-[#2d8c83] transition"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[14px] px-5 py-4 text-black dark:text-white">
                Copyright © 2023 ELearning
              </p>
            </div>
          </div>
        )}
      </div>

      {/* modals */}
      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
          refetch={refetch}
        />
      )}
      {route === "Sign-Up" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}
      {route === "Verification" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}
    </div>
  );
};

export default Header;
