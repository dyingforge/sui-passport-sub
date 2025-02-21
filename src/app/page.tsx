"use client"
import Image from "next/image";
import { ContributorsTable } from "~/components/ContributorsTable/ContributorsTable";
import { PassportCreationModal } from "~/components/PassportCreationModal/PassportCreationModal";
import { ProfileModal } from "~/components/ProfileModal/ProfileModal";
import { Sticker } from "~/components/Sticker/Sticker";
import { usePassportsStamps } from "~/context/passports-stamps-context";
import { useEffect, useState } from "react";
import { useNetworkVariables } from "~/lib/contracts";
import {  type Contributor } from "~/components/ContributorsTable/columns";
import { useUserCrud } from "~/hooks/use-user-crud";
import { usersToContributor } from "~/lib/utils";

export default function HomePage() {
  const { refreshPassportStamps } = usePassportsStamps()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const networkVariables = useNetworkVariables()
  const { fetchUsers } = useUserCrud()

  useEffect(() => {
    void refreshPassportStamps(networkVariables)
  }, [networkVariables, refreshPassportStamps])

  useEffect(() => {
    const fetchContributors = async () => {
      const users = await fetchUsers()
      if (users) {
        const contributors = usersToContributor(users)
        setContributors(contributors)
      }
    }
    void fetchContributors()
  }, [])
  
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
        <div className="relative mt-6 flex min-h-[745px] w-full flex-col items-center rounded-t-xl bg-[#02101C] pl-2 pr-2 sm:min-h-[902px]">
          <Image
            className="absolute top-0 hidden rounded-xl sm:block"
            src={"/images/card-background.png"}
            alt="background"
            width={1424}
            height={893}
            unoptimized
          />
          <Image
            className="absolute top-0 block rounded-xl sm:top-[-234px] sm:hidden"
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
          <PassportCreationModal />
        </div>
        <div className="relative mt-[-32px] flex w-full flex-col items-center bg-gradient-to-t from-[#02101C] from-95% pl-2 pr-2">
          <h1 className="mt-40 max-w-[358px] text-center font-everett text-[40px] leading-[48px] sm:mt-16 sm:max-w-[696px] sm:text-[68px] sm:leading-[80px]">
            Get your stamps
          </h1>
          <div className="mt-6 flex max-w-[358px] flex-col text-center font-everett_light text-[14px] text-[#ABBDCC] sm:max-w-[580px] sm:text-[16px]">
            <p>
              Here are the latest stamps awarded to the Sui community,
              celebrating achievements and contributions
            </p>
          </div>
          <div className="mt-[37px] flex flex-col-reverse justify-between sm:min-w-[900px] sm:flex-row">
            <div className="flex flex-col">
              <Sticker
                url={"/images/walrus.png"}
                name="Month of Walrus"
                rotation={-5}
                amountLeft={95}
                dropsAmount={500}
                className="hidden sm:block"
              />
              <Sticker
                url={"/images/passport-pioneer.png"}
                name="Passport Pioneer"
                rotation={-5}
                amountLeft={45}
                dropsAmount={100}
                isClaimed
              />
            </div>
            <Sticker
              url={"/images/cabo.png"}
              name="CABO"
              rotation={-5}
              amountLeft={95}
              dropsAmount={500}
              className="hidden sm:block"
            />
            <div className="flex flex-col">
              <Sticker
                url={"/images/passport-pioneer.png"}
                name="Passport Pioneer"
                rotation={5}
                amountLeft={45}
                dropsAmount={100}
                className="hidden sm:block"
              />
              <Sticker
                url={"/images/walrus.png"}
                name="Month of Walrus"
                rotation={5}
                amountLeft={95}
                dropsAmount={500}
              />
            </div>
          </div>
          <h2 className="mt-[185px] max-w-[263px] text-center font-everett text-[24px] leading-[28px] sm:text-[32px] sm:leading-[38px]">
            Top Contributors
          </h2>
          <div className="mb-[48px] mt-6 sm:mb-[80px]">
            <ContributorsTable data={contributors} />
          </div>
        </div>
      </div>
    </main>
  );
}
