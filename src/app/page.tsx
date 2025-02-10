import Image from "next/image";
import { columns } from "~/components/ContributorsTable/columns";
import { ContributorsTable } from "~/components/ContributorsTable/ContributorsTable";
import { contributors } from "~/components/ContributorsTable/data";
import { PassportCreationModal } from "~/components/PassportCreationModal/PassportCreationModal";
import { Sticker } from "~/components/Sticker/Sticker";
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
        <div className="relative mt-6 flex min-h-[1458px] w-full flex-col items-center rounded-t-xl bg-[#001731] pl-2 pr-2">
          <Image
            className="absolute top-0 rounded-xl"
            src={"/images/card-background.png"}
            alt="background"
            width={1424}
            height={893}
            unoptimized
          />
          <div className="z-10 flex w-full max-w-[1424px] flex-col items-center justify-center">
            <h1 className="mt-16 max-w-[696px] text-center font-everett text-[68px] leading-[80px]">
              Make your mark on the Sui Community
            </h1>
            <div className="mt-6 flex max-w-[696px] flex-col gap-3 text-center font-everett_light text-[16px] text-[#ABBDCC]">
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
          <div className="z-10 mt-[80px] flex w-[720px] flex-col justify-center gap-1 rounded-3xl bg-gradient-to-r from-[#213244] from-20% via-[#13273d] to-[#17293c] px-6 py-5 text-[#ABBDCC]">
            <Label
              htmlFor="id"
              className="font-inter text-[20px] font-light leading-[25px]"
            >
              Claim your name for Sui Passport
            </Label>
            <Input
              className="h-[58px] font-everett text-[48px] text-white"
              type="text"
              id="id"
              placeholder="Your Name"
            />
          </div>
          <PassportCreationModal />
        </div>
        <div className="relative flex w-full flex-col items-center bg-[#001731] pl-2 pr-2">
          <h1 className="mt-16 max-w-[696px] text-center font-everett text-[68px] leading-[80px]">
            Get your stamps
          </h1>
          <div className="mt-6 flex max-w-[580px] flex-col text-center font-everett_light text-[16px] text-[#ABBDCC]">
            <p>
              Here are the latest stamps awarded to the Sui community,
              celebrating achievements and contributions
            </p>
          </div>
          <div className="mt-[37px] flex min-w-[900px] justify-between">
            <Sticker url={"/images/sticker2.png"} />
            <Sticker url={"/images/sticker1.png"} />
          </div>
          <h2 className="mt-[185px] max-w-[263px] text-center font-everett text-[32px] leading-[38px]">
            Top Contributors
          </h2>
          <div className="mb-[184px] mt-12">
            <ContributorsTable data={contributors} columns={columns} />
          </div>
        </div>
      </div>
    </main>
  );
}
