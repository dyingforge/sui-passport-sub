import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#02101C] text-white">
      <div className="flex w-full max-w-[1424px] flex-col items-center">
        <div className="mt-6 flex w-full justify-between pl-[35px] pr-6">
          <div className="flex items-center gap-3">
            <Image src={"/images/drop.png"} alt="drop" width={24} height={32} />
            <p className="font-inter text-[24px]">Sui passport</p>
          </div>
          <Button className="h-[52px] w-[189px]">
            <Image
              src={"/images/wallet.png"}
              alt="wallet"
              width={16}
              height={16}
            />
            Connect Wallet
          </Button>
        </div>
        <div className="relative mt-6 flex min-h-[1458px] w-full flex-col items-center rounded-xl bg-[#001731] pl-2 pr-2">
          <Image
            className="absolute top-0 rounded-xl"
            src={"/images/card-background.png"}
            alt="background"
            width={1424}
            height={893}
            quality="100"
          />
          <div className="z-10 flex w-full max-w-[1424px] flex-col items-center justify-center">
            <h1 className="font-everett mt-16 max-w-[696px] text-center text-[68px] leading-[80px]">
              Make your mark on the Sui Community
            </h1>
            <div className="font-everett_light mt-6 flex max-w-[696px] flex-col gap-3 text-center text-[16px] text-[#ABBDCC]">
              <p>
                The Sui community flourishes because of passionate members like
                you. Through content, conferences, events and hackathons, your
                contributions help elevate our Sui Community
              </p>
              <p>
                Now it’s time to showcase your impact, gain recognition, and
                unlock rewards for your active participation. Connect your
                wallet today and claim your first stamp!
              </p>
            </div>
          </div>
          <div className="z-10 mt-[80px] flex w-[720px] flex-col justify-center gap-1 rounded-3xl bg-gradient-to-r from-20% from-[#213244] via-[#13273d] to-[#17293c] px-6 py-5 text-[#ABBDCC]">
            <Label htmlFor="id" className="font-inter text-[20px] font-light leading-[25px]">
              Claim your name for Sui Passport
            </Label>
            <Input
              className="font-everett h-[58px] text-[48px] text-white"
              type="text"
              id="id"
              placeholder="Your Name"
            />
          </div>
          <Button className="h-[52px] w-[188px] z-10 mt-12">
            Get Your Passport
          </Button>
        </div>
      </div>
    </main>
  );
}
