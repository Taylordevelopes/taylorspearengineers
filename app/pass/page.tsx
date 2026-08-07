"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/SpearitualCompany_logo_white.png";

type WalletLinks = {
  appleUrl: string;
  googleUrl: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  city?: string;
  phone?: string;
};

type PassResponse = {
  member: Member;
  wallet: WalletLinks;
  barcodeUrl: string;
};

export default function Page(): React.JSX.Element {
  const [member, setMember] = useState<Member | null>(null);
  const [walletLinks, setWalletLinks] = useState<WalletLinks | null>(null);
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [showGoogleComingSoon, setShowGoogleComingSoon] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadPass = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const params = new URLSearchParams(window.location.search);
        const email = params.get("email");

        if (!email) {
          throw new Error("Member email was not provided.");
        }

        const response = await fetch(
          `https://api.spearitual.xyz/members/pass?email=${encodeURIComponent(
            email,
          )}`,
        );

        const data: PassResponse | { error: string } = await response.json();

        if (!response.ok) {
          throw new Error(
            "error" in data ? data.error : "Unable to load your Healix pass.",
          );
        }

        const passData = data as PassResponse;

        setMember(passData.member);
        setWalletLinks(passData.wallet);
        setBarcodeUrl(passData.barcodeUrl);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load your Healix pass.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPass();
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff00]">
          Generating Your Healix Pass...
        </p>
      </main>
    );
  }

  if (loadError || !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <p className="max-w-sm text-center text-sm font-semibold text-red-400">
          {loadError || "Unable to load your Healix pass."}
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Digital card preview */}
        <div className="relative overflow-hidden rounded-[10px] bg-[#00ff00] px-6 pb-7 pt-6 text-black shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
          <p className="text-lg font-semibold tracking-tight">Healix</p>

          <div className="mt-8 flex items-start justify-between">
            <div>
              <p className="mb-0 text-[10px] font-extrabold uppercase tracking-[0.2em]">
                Healix Status
              </p>

              <p className="text-4xl font-semibold leading-none">Active</p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-black p-2 shadow-lg">
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
            <p className="mb-0 mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em]">
              Encounter Points
            </p>

            <p className="mt-1 font-normal leading-none">0</p>
          </div>

          {/* Member details */}
          <div className="mt-6 flex items-start justify-between">
            <div>
              <p className="mb-0 mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.2em]">
                Name
              </p>

              <p className="mt-1 font-normal leading-tight">{member.name}</p>
            </div>

            <div>
              <p className="mb-0 mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.2em]">
                Designation
              </p>

              <p className="mt-1 font-normal uppercase">Enrolled</p>
            </div>
          </div>

          {/* Barcode */}
          <div className="mt-20 flex flex-col items-center">
            {barcodeUrl && (
              <img
                src={barcodeUrl}
                alt="Healix Member Barcode"
                className="h-auto w-full max-w-[340px]"
              />
            )}
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
            <div
              onClick={() => setShowGoogleComingSoon(true)}
              className="flex cursor-pointer items-center justify-center gap-3 py-4 text-neutral-500 transition hover:text-neutral-300"
            >
              <GoogleWalletIcon />

              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase tracking-[0.2em]">
                  Coming Soon
                </span>

                <span className="block text-lg font-semibold">
                  Google Wallet
                </span>
              </div>
            </div>
          )}
        </div>

        {showGoogleComingSoon && (
          <div className="mt-3 rounded-xl border border-neutral-300 bg-neutral-100 p-3 text-center">
            <p className="text-sm font-medium text-neutral-700">
              Google Wallet support coming soon.
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Apple Wallet is available today. Google Wallet will be enabled
              automatically once provision is complete.
            </p>
          </div>
        )}

        <div className=" flex items-center justify-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/60">
            Powered by
          </span>

          <Image
            src={logo}
            alt="Spearitual Company"
            width={100}
            className="h-auto object-contain"
          />
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
