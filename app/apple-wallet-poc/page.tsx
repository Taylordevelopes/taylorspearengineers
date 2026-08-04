"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getWalletPassUrl } from "../lib/api/wallet";

export default function Page(): React.JSX.Element {
  const walletPassUrl = getWalletPassUrl();
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    answer: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    setShowForm(false);
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

          <Button variant="dark" type="submit">
            Save Changes
          </Button>
        </Form>
      </main>
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#efefec] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-4xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.16)]">
          <div className="relative min-h-67.5 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-700 p-8 text-white">
            <div className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-bold backdrop-blur">
              H
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Digital Pass
            </p>

            <h1 className="mt-3 text-2xl font-semibold">HEALIX PASS</h1>

            <div className="mt-20">
              <p className="text-sm text-white/50">Card holder</p>

              <p className="mt-1 text-3xl font-medium">
                {formData.firstName} {formData.lastName}
              </p>

              <p className="mt-2 text-sm text-white/60">
                Location-aware digital membership card
              </p>
            </div>
          </div>

          <div className="space-y-5 p-7">
            <div className="rounded-2xl bg-neutral-100 p-4">
              <div className="flex items-start gap-3">
                <LocationIcon />

                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Location relevance enabled
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Apple Wallet may surface this pass when you approach a
                    location configured by the server.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={walletPassUrl}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-4 text-white transition hover:bg-neutral-800 active:scale-[0.98]"
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

            <p className="text-center text-xs text-neutral-400">
              Open this page in Safari on an iPhone.
            </p>
          </div>
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
