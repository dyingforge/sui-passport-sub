"use client";
import Image from "next/image";
import { ContributorsTable } from "~/components/ContributorsTable/ContributorsTable";
import { PassportCreationModal } from "~/components/PassportCreationModal/PassportCreationModal";
import { ProfileModal } from "~/components/ProfileModal/ProfileModal";
import { Sticker } from "~/components/Sticker/Sticker";
import { usePassportsStamps } from "~/context/passports-stamps-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNetworkVariables } from "~/lib/contracts";
import { type Contributor } from "~/components/ContributorsTable/columns";
import { useUserCrud } from "~/hooks/use-user-crud";
import {
  usersToContributor,
  stampsToDisplayStamps,
  distributeStamps,
  STICKER_LAYOUT_CONFIG,
  stampsToDisplayStampsWithOutPassport,
} from "~/lib/utils";
import type { VerifyClaimStampRequest, DisplayStamp } from "~/types/stamp";
import { useUserProfile } from "~/context/user-profile-context";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import {
  useBetterSignAndExecuteTransactionWithSponsor,
} from "~/hooks/use-better-tx";
import { claim_stamp } from "~/lib/contracts/claim";
import { useStampCRUD } from "~/hooks/use-stamp-crud";
import { type PassportFormSchema } from "~/types/passport";
import { mint_passport } from "~/lib/contracts/passport";
import { toast } from "sonner";

export default function HomePage() {
  const { stamps, refreshPassportStamps } = usePassportsStamps();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [displayStamps, setDisplayStamps] = useState<DisplayStamp[]>([]);
  const networkVariables = useNetworkVariables();
  const { fetchUsers, isLoading } = useUserCrud();
  const { userProfile, refreshProfile } = useUserProfile();
  const { verifyClaimStamp } = useStampCRUD();
  const currentAccount = useCurrentAccount();
  const { connectionStatus } = useCurrentWallet();
  const [openStickers, setOpenStickers] = useState<Record<string, boolean>>({});
  const { createOrUpdateUser } = useUserCrud();

  const { handleSignAndExecuteTransactionWithSponsor: handleClaimStampTx, isLoading: isClaimingStamp } =
    useBetterSignAndExecuteTransactionWithSponsor({
      tx: claim_stamp,
    });

  const {
    handleSignAndExecuteTransactionWithSponsor,
    isLoading: isMintingPassportWithSponsor,
  } = useBetterSignAndExecuteTransactionWithSponsor({
    tx: mint_passport,
  });

  const initializeData = useCallback(async () => {
    const users = await fetchUsers();
    if (users) {
      setContributors(usersToContributor(users));
    }
  }, [fetchUsers]);

  useEffect(() => {
    void initializeData();
  }, [initializeData]);

  useEffect(() => {
    setDisplayStamps([]);
    if (stamps && userProfile) {
      setDisplayStamps(stampsToDisplayStamps(stamps, userProfile));
    } else if (stamps) {
      setDisplayStamps(stampsToDisplayStampsWithOutPassport(stamps));
    }
  }, [stamps, userProfile]);

  useEffect(() => {
    if (networkVariables) {
      void refreshPassportStamps(networkVariables);
    }
  }, [networkVariables, refreshPassportStamps, connectionStatus]);

  const handleClaimStampClick = async (code: string, stamp: DisplayStamp) => {
    if (!userProfile?.passport_id) {
      toast.error("You should have a passport to claim a stamp");
      return;
    }
    const stamps = userProfile?.stamps;
    if (stamps?.some((stamp) => stamp.name.split("#")[0] === stamp?.name)) {
      toast.error(`You have already have this stamp`);
      return;
    }
    if (
      stamp.claimCount &&
      stamp.totalCountLimit !== 0 &&
      stamp?.claimCount >= stamp.totalCountLimit!
    ) {
      toast.error("Stamp is claimed out");
      return;
    }
    const requestBody: VerifyClaimStampRequest = {
      stamp_id: stamp?.id,
      claim_code: code,
      passport_id: userProfile?.id.id,
      last_time: Number(userProfile?.last_time),
    };
    const data = await verifyClaimStamp(requestBody);

    if (!data.signature || !data.valid) {
      toast.error("Invalid claim code");
      return;
    }
    // Convert signature object to array
    const signatureArray = Object.values(data.signature);
    await handleClaimStampTx(
      process.env.NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
      currentAccount?.address ?? "",
      [currentAccount?.address ?? ""],
      {
        event: stamp?.id ?? "",
        passport: userProfile?.id.id ?? "",
        name: stamp?.name ?? "",
        sig: signatureArray,
      },
    )
      .onSuccess(async () => {
        toast.success("Stamp claimed successfully");
        handleOpenChange(stamp.id, false);
        await refreshProfile(currentAccount?.address ?? "", networkVariables);
        await refreshPassportStamps(networkVariables);
      })
      .execute();
  };

  const handlePassportCreation = async (values: PassportFormSchema) => {
    const formData = new FormData();
    if (values.avatarFile) {
      if (!(values.avatarFile instanceof Blob)) {
        throw new Error("Avatar file must be a valid image file");
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        formData.append("file", values.avatarFile);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        values.avatar = data.url;
      } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error; // Re-throw to interrupt the method
      }
    }
    await handleSignAndExecuteTransactionWithSponsor(
      process.env.NEXT_PUBLIC_NETWORK as "testnet" | "mainnet",
      currentAccount?.address ?? "",
      [currentAccount?.address ?? ""],
      {
        name: values.name,
        avatar: values.avatar ?? "",
        introduction: values.introduction ?? "",
        x: values.x ?? "",
        github: values.github ?? "",
        email: "",
      },
    )
      .onSuccess(async () => {
        toast.success("Passport minted successfully");
        await refreshProfile(currentAccount?.address ?? "", networkVariables);
        await refreshPassportStamps(networkVariables);
      })
      .onError((error) => {
        toast.error(`Error minting passport: ${error.message}`);
      })
      .execute();
  };

  const handleOpenChange = (stampId: string, isOpen: boolean) => {
    setOpenStickers((prev) => ({
      ...prev,
      [stampId]: isOpen,
    }));
  };

  const handleTableRefresh = useCallback(
    async () => {
      if (currentAccount?.address && userProfile?.passport_id) {
        void createOrUpdateUser({
          address: currentAccount.address,
          stamp_count: userProfile.stamps?.length ?? 0,
          name: userProfile.name,
          points: Number(userProfile.points),
        })
      }

      void initializeData();
    },
    [initializeData, userProfile, currentAccount, createOrUpdateUser],
  );

  const stampsLayout = useMemo(
    () => distributeStamps(displayStamps),
    [displayStamps],
  );

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
        <div className="relative mt-6 flex w-full flex-col items-center rounded-t-xl bg-[#02101C] pl-2 pr-2 ">
          <Image
            className="absolute top-0 hidden rounded-xl sm:block brightness-[60%]"
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
            {!userProfile?.passport_id ? (
              <>
                <div className="mt-6 flex max-w-[342px] flex-col gap-3 text-center font-everett_light text-[14px] text-[#ABBDCC] sm:max-w-[696px] sm:text-[16px]">
                  <p>
                    The Sui community flourishes because of passionate members like you. Through content and events, your contributions help elevate our Sui Community.
                  </p>
                  <p>
                    Connect your wallet today and claim your first stamp!
                  </p>
                </div>
                <PassportCreationModal
                  onSubmit={handlePassportCreation}
                  isLoading={isMintingPassportWithSponsor}
                />
              </>
            ) : <div className="mt-6 flex max-w-[342px] flex-col gap-3 text-center font-everett_light text-[14px] text-[#ABBDCC] sm:max-w-[696px] sm:text-[16px]">
              <p>
                The Sui community flourishes because of passionate members like you. Through content and events, your contributions help elevate our Sui Community. Connect your wallet today and claim your first stamp!
              </p>
            </div>}
          </div>
        </div>
        <div className="relative mt-16 flex w-full flex-col items-center bg-gradient-to-t from-[#02101C] from-95% pl-2 pr-2">
          <h1 className="mt-40 max-w-[358px] text-center font-everett text-[40px] leading-[48px] sm:mt-16 sm:max-w-[696px] sm:text-[68px] sm:leading-[80px]">
            Get your stamps
          </h1>
          {/* <div className="mt-6 flex max-w-[358px] flex-col text-center font-everett_light text-[14px] text-[#ABBDCC] sm:max-w-[580px] sm:text-[16px]">
            <p>
              The Sui community flourishes because of passionate members like
              you. Through content and events, your contributions help elevate
              our Sui Community. Connect your wallet today and claim your first
              stamp!
            </p>
          </div> */}
          <div className="mt-[37px] flex flex-col-reverse justify-between sm:min-w-[900px] sm:flex-row">
            <div className="flex flex-col">
              {stampsLayout.left.map((stamp, index) => (
                <Sticker
                  key={stamp.id}
                  stampId={stamp.id}
                  url={stamp.imageUrl ?? ""}
                  name={stamp.name}
                  rotation={STICKER_LAYOUT_CONFIG.left[index]?.rotation ?? 0}
                  amountLeft={
                    stamp.totalCountLimit && stamp.claimCount ? stamp.totalCountLimit - (stamp.claimCount ?? 0) : Infinity
                  }
                  dropsAmount={
                    stamp.claimedCount ?? 0
                  }
                  isClaimed={stamp.isClaimed ?? false}
                  isPublicClaim={stamp.publicClaim}
                  open={openStickers[stamp.id] ?? false}
                  onOpenChange={(open) => handleOpenChange(stamp.id, open)}
                  onClaim={(code) => handleClaimStampClick(code, stamp)}
                  isLoading={isClaimingStamp}
                />
              ))}
            </div>
            <div className="flex flex-col">
              {stampsLayout.center.map((stamp, index) => (
                <Sticker
                  key={stamp.id}
                  stampId={stamp.id}
                  url={stamp.imageUrl ?? ""}
                  name={stamp.name}
                  rotation={STICKER_LAYOUT_CONFIG.center[index]?.rotation ?? 0}
                  amountLeft={
                    stamp.totalCountLimit && stamp.claimCount ? stamp.totalCountLimit - (stamp.claimCount ?? 0) : Infinity
                  }
                  dropsAmount={
                    stamp.claimedCount ?? 0
                  }
                  isClaimed={stamp.isClaimed ?? false}
                  isPublicClaim={stamp.publicClaim}
                  open={openStickers[stamp.id] ?? false}
                  onOpenChange={(open) => handleOpenChange(stamp.id, open)}
                  onClaim={(code) => handleClaimStampClick(code, stamp)}
                  isLoading={isClaimingStamp}
                />
              ))}
            </div>
            <div className="flex flex-col">
              {stampsLayout.right.map((stamp, index) => (
                <Sticker
                  key={stamp.id}
                  stampId={stamp.id}
                  url={stamp.imageUrl ?? ""}
                  name={stamp.name}
                  rotation={STICKER_LAYOUT_CONFIG.right[index]?.rotation ?? 0}
                  amountLeft={
                    stamp.totalCountLimit && stamp.claimCount ? stamp.totalCountLimit - (stamp.claimCount ?? 0) : Infinity
                  }
                  dropsAmount={
                    stamp.claimedCount ?? 0
                  }
                  isClaimed={stamp.isClaimed ?? false}
                  isPublicClaim={stamp.publicClaim}
                  open={openStickers[stamp.id] ?? false}
                  onOpenChange={(open) => handleOpenChange(stamp.id, open)}
                  onClaim={(code) => handleClaimStampClick(code, stamp)}
                  isLoading={isClaimingStamp}
                />
              ))}
            </div>
          </div>
          <h2 className="mt-[185px] max-w-[263px] text-center font-everett text-[24px] leading-[28px] sm:text-[32px] sm:leading-[38px]">
            Top Contributors
          </h2>
          <div className="mb-[48px] mt-6 w-full sm:mb-[80px]">
            <ContributorsTable
              data={contributors}
              onRefresh={handleTableRefresh}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
