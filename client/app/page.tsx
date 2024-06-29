"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen]=useState(false);
  const [activeItems,setActive]=useState(0);
  const[route,setRoute]=useState("Login")
  return (<div>
    <Heading
    title="ELerning"
    description="Elearning is platform for student to learn and get help from teachers"
    keywords="MERN, web devlopment, machine learning"
  
    />
    <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItems}
      route={route}
      setRoute={setRoute}
    />
    <Hero/>
  </div>);
};
export default Page;
