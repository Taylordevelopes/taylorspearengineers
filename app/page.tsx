"use client";
import Image from "next/image";
import { Button, Form, InputGroup } from "react-bootstrap";
import { subscribe } from "./lib/api/subscribe";
import { useState } from "react";
import HeroSlider from "./components/HeroSlider";
import logo from "../public/SpearitualCompany_logo.png";
import CountdownTimer from "./components/CountDownTimer";

export default function Home() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [siteMaintenance, setSiteMaintenance] = useState(true);

  const handleSubscribe = async (email: string) => {
    try {
      setSuccessMessage("");
      setErrorMessage("");
      const data = await subscribe(email);
      console.log("Subscription successful:", data);
      setEmail("");
      setSuccessMessage("Thank you for subscribing!");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Subscription failed:", error);
      setErrorMessage("Failed to subscribe. Please try again.");

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  if (siteMaintenance) {
    return (
      <div className="flex flex-col flex-1 items-center text-center justify-center font-sans ">
        <Image src={logo} alt="Spearitual LLC" width={750} height={750} />

        <p className="font-bold">
          Switching Servers and Making upgrades be back soon.
        </p>
        <div>
          <CountdownTimer targetDate="2026-08-07T00:00:00" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-8 bg-white ">
        <HeroSlider />

        <p className="text-center pt-10 text-lg md:text-xl max-w-2xl text-gray-800 font-semibold ">
          The mission is simple, but not easy. we are passionate about building
          scalable systems and unique applications of all types that bring value
          to the world and the people that use them. Thanks for stopping by and
          please subscribe to our monthly newsletter. From coding to music,
          books and everything in between. We love connecting with people!
          Together Let's Push The World Forward.
        </p>
        {/* <div className="flex flex-row gap-4">
          <Button variant="outline-secondary">+Music </Button>
          <Button variant="outline-secondary">+Code</Button>
        </div> */}
        <div>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter your email"
              aria-label="Enter your email"
              aria-describedby="basic-addon2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              onClick={() => handleSubscribe(email)}
            >
              Subscribe
            </Button>
          </InputGroup>

          {successMessage && (
            <div className=" text-center mb-3 font-medium">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="text-red-600 text-center mb-3">{errorMessage}</div>
          )}
        </div>
      </main>
    </div>
  );
}
