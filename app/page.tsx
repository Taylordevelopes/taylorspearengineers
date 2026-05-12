import Image from "next/image";
import { Button, Form, InputGroup } from "react-bootstrap";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white ">
        <h1 className="flex flex-col text-4xl text-center font-bold">
          Taylor Spear
        </h1>

        <div className="p-6">
          <Image
            src="/taylor-spear.jpg" // Route from the public folder
            alt="Profile Picture"
            width={300}
            height={300}
          />
        </div>
        <p className="text-center">
          The mission is simple, but not easy and subject to change. I love
          building systems and unique applications of all types that are unique
          to me but bring value to the world and the people that use them. My
          name is Taylor, thanks for stopping by and please subscribe to my
          monthly newsletter, from music to code and everything in between. I
          love connecting with people! Together let's Push the world forward.
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
            />
            <Button variant="outline-secondary" id="button-addon2">
              Subscribe
            </Button>
          </InputGroup>
        </div>
      </main>
    </div>
  );
}
