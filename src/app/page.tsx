import Image from "next/image";
import { ContributorsTable } from "~/components/ContributorsTable/ContributorsTable";
import { contributors } from "~/components/ContributorsTable/data";
import { PassportCreationModal } from "~/components/PassportCreationModal/PassportCreationModal";
import { ProfileModal } from "~/components/ProfileModal/ProfileModal";
import { Sticker } from "~/components/Sticker/Sticker";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#02101C] text-white">
      <div className="flex w-full max-w-[375px] flex-col items-center sm:max-w-[1424px]">
        <div className="mt-6 flex w-full justify-between px-3 sm:pl-[35px] sm:pr-6">
          <div className="flex items-center gap-3">
            <Image
              src={"/images/drop.png"}
              alt="drop"
              width={24}
              height={32}
              className="h-[20px] w-[16px] sm:h-[32px] sm:w-[24px]"
            />
            <p className="font-inter text-[16px] sm:text-[24px]">
              Sui passport
            </p>
          </div>
          <ProfileModal />
        </div>
        <div className="relative mt-6 flex min-h-[1045px] sm:min-h-[1458px] w-full flex-col items-center rounded-t-xl bg-[#001731] pl-2 pr-2">
          <Image
            className="absolute rounded-xl hidden sm:block top-0"
            src={"/images/card-background.png"}
            alt="background"
            width={1424}
            height={893}
            unoptimized
          />
          <Image
            className="absolute top-[125px] sm:hidden block rounded-xl sm:top-0"
            src={"/images/mobile-card-background.png"}
            alt="background"
            width={374}
            height={491}
            unoptimized
          />
          <div className="z-10 flex w-full max-w-[1424px] flex-col items-center justify-center">
            <h1 className="mt-8 max-w-[304px] text-center font-everett text-[40px] leading-[48px] sm:mt-16 sm:max-w-[696px] sm:text-[68px] sm:leading-[80px]">
              Make your mark on the Sui Community
            </h1>
            <div className="mt-6 flex max-w-[342px] flex-col gap-3 text-center font-everett_light text-[14px] text-[#ABBDCC] sm:max-w-[696px] sm:text-[16px]">
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
          <div className="z-10 mt-12 flex w-[342px] flex-col justify-center gap-1 rounded-3xl bg-gradient-to-r from-[#213244] from-20% via-[#13273d] to-[#17293c] px-6 py-5 text-[#ABBDCC] sm:mt-[80px] sm:w-[720px]">
            <Label
              htmlFor="id"
              className="font-inter text-[16px] font-light leading-[25px] sm:text-[20px]"
            >
              Claim your name for Sui Passport
            </Label>
            <Input
              className="h-[38px] font-everett text-[32px] text-white sm:h-[58px] sm:text-[48px]"
              type="text"
              id="id"
              placeholder="Your Name"
            />
          </div>
          <PassportCreationModal />
        </div>
        <div className="relative flex w-full flex-col items-center bg-[#001731] pl-2 pr-2">
          <h1 className="mt-40 sm:mt-16 max-w-[358px] sm:max-w-[696px] text-center font-everett text-[40px] sm:text-[68px] leading-[48px] sm:leading-[80px]">
            Get your stamps
          </h1>
          <div className="mt-6 flex max-w-[358px] sm:max-w-[580px] flex-col text-center font-everett_light text-[14px] sm:text-[16px] text-[#ABBDCC]">
            <p>
              Here are the latest stamps awarded to the Sui community,
              celebrating achievements and contributions
            </p>
          </div>
          <div className="mt-[37px] flex flex-col-reverse sm:flex-row sm:min-w-[900px] justify-between">
            <Sticker
              url={"/images/cabo.png"}
              name="CABO"
              rotation={-5}
              amountLeft={95}
              dropsAmount={500}
            />
            <Sticker
              url={"/images/passport-pioneer.png"}
              name="Passport Pioneer"
              rotation={5}
              amountLeft={45}
              dropsAmount={100}
              isClaimed
            />
          </div>
          <h2 className="mt-[185px] max-w-[263px] text-center font-everett text-[24px] sm:text-[32px] leading-[28px] sm:leading-[38px]">
            Top Contributors
          </h2>
          <div className="mb-[48px] sm:mb-[80px] mt-6">
            <ContributorsTable data={contributors} />
          </div>
        </div>
      </div>
    </main>
  );
}
