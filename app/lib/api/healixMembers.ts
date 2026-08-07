type MemberSignupPayload = {
  name: string;
  email: string;
  phone: string;
  city: string;
  answer: string;
  emailOptIn: boolean;
};

export async function memberSignUp(payload: MemberSignupPayload) {
  const response = await fetch("https://api.spearitual.xyz/members/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to create membership");
  }

  return data;
}
