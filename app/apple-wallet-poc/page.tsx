"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { memberSignUp } from "../lib/api/healixMembers";
import Image from "next/image";

type WalletLinks = {
  appleUrl: string;
  googleUrl: string;
};

export default function Page(): React.JSX.Element {
  const [showForm, setShowForm] = useState(true);
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    answer: "",
  });

  const [walletLinks, setWalletLinks] = useState<WalletLinks | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [member, setMember] = useState<any>(null);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const data = await memberSignUp({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        answer: formData.answer.trim(),
        emailOptIn: false,
      });

      console.log("Signup response:", data);
      console.log("Google URL:", data.wallet?.googleUrl);
      setWalletLinks(data.wallet);
      setBarcodeUrl(data.barcodeUrl);

      setShowForm(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to process your membership",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForm)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#efefec] px-4 py-12">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="editfirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder="First Name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editAppDescription">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder="Last Name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editAppEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder="Enter email address"
            />
            <Form.Text className="text-muted">
              We will never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editAppPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder="Enter phone number"
            />
            <Form.Text className="text-muted">
              Include country code for international numbers.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="editAppCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              placeholder="Enter city name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="appDescription">
            <Form.Label>Do you believe art heals? Why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="answer"
              value={formData.answer}
              placeholder="Type your answer here"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </Form.Group>

          <Button variant="dark" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Pass..." : "Create Digital Pass"}
          </Button>
          {submitError && (
            <p className="mb-3 text-sm font-semibold text-red-600">
              {submitError}
            </p>
          )}
        </Form>
      </main>
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Digital card preview */}
        <div className="relative overflow-hidden rounded-[10px] bg-[#00ff00] px-6 pb-7 pt-6 text-black shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <p className="text-lg font-semibold tracking-tight">Healix</p>
          <div className="mt-8 flex items-start justify-between">
            <div>
              <p className="mb-0 text-[10px] font-extrabold   uppercase tracking-[0.2em] ">
                Healix Status
              </p>

              <p className=" text-4xl font-semibold leading-none">Active</p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden  bg-black p-2 shadow-lg">
              <Image
                src="/healix-symbol.png"
                alt="Healix"
                width={80}
                height={80}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>

          {/* Encounter points */}
          <div className="mt-2">
            <p className=" mb-0! mt-0.5 text-[10px] font-extrabold  uppercase tracking-[0.2em]">
              Encounter Points
            </p>

            <p className="mt-1 font-normal leading-none">0</p>
          </div>

          {/* Member details */}
          <div className="mt-6 flex items-start justify-between">
            <div>
              <p className="mb-0! mt-0.5 text-[9px] font-extrabold   uppercase tracking-[0.2em]">
                Name
              </p>

              <p className="mt-1 font-normal leading-tight">
                {formData.firstName} {formData.lastName}
              </p>
            </div>

            <div>
              <p className="mb-0! mt-0.5 text-[9px] font-extrabold  uppercase tracking-[0.2em]">
                Designation
              </p>

              <p className="mt-1 font-normal uppercase">Enrolled</p>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center">
            <img
              src={barcodeUrl}
              alt="Healix Member Barcode"
              className="h-auto w-full max-w-[340px]"
            />

            <p className="mt-2 text-sm tracking-[0.15em]">{member?.id}</p>
          </div>
        </div>

        {/* Wallet actions */}
        <div className="mt-6 space-y-3">
          {walletLinks?.appleUrl && (
            <a
              href={walletLinks.appleUrl}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98]"
            >
              <AppleIcon />

              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-white/70">
                  Add to
                </span>

                <span className="block text-lg font-semibold">
                  Apple Wallet
                </span>
              </span>
            </a>
          )}

          {walletLinks?.googleUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                window.location.href = walletLinks.googleUrl;
              }}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98]"
            >
              <GoogleWalletIcon />

              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-white/70">
                  Add to
                </span>

                <span className="block text-lg font-semibold">
                  Google Wallet
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-xs leading-5 text-neutral-500">
            Choose the wallet supported by your device to save your Healix
            membership card.
          </p>
        </div>
      </div>
    </main>
  );
}

function AppleIcon(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-current"
    >
      <path d="M17.05 12.536c-.031-3.016 2.463-4.486 2.576-4.554-1.414-2.066-3.611-2.348-4.389-2.37-1.846-.194-3.637 1.105-4.577 1.105-.959 0-2.407-1.086-3.967-1.054-2.008.031-3.887 1.194-4.917 3.001-2.126 3.68-.54 9.088 1.496 12.063 1.019 1.458 2.21 3.086 3.77 3.028 1.526-.063 2.096-.973 3.938-.973 1.825 0 2.36.973 3.95.936 1.638-.026 2.67-1.465 3.653-2.936 1.178-1.674 1.651-3.322 1.67-3.407-.039-.013-3.122-1.19-3.153-4.869zM14.031 3.654C14.851 2.628 15.412 1.234 15.256-.18c-1.187.052-2.67.823-3.524 1.826-.756.882-1.431 2.329-1.256 3.69 1.336.1 2.678-.676 3.555-1.682z" />
    </svg>
  );
}
function GoogleWalletIcon(): React.JSX.Element {
  return (
    <Image
      src="/google-g.png"
      alt="Google Wallet"
      width={36}
      height={36}
      className="h-9 w-9 object-contain"
    />
  );
}

function LocationIcon(): React.JSX.Element {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-black"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z"
        />
        <circle cx="12" cy="9" r="2.3" />
      </svg>
    </div>
  );
}
