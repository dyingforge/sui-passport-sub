import { createBetterTxFactory } from "~/lib/contracts";

export const mint_passport = createBetterTxFactory<{
    name: string;
    avatar: string;
    introduction: string;
    x: string;
    github: string;
    email: string;
}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.package,
        module: "sui_passport",
        function: "mint_passport",
        arguments: [
            tx.object(networkVariables.suiPassportRecord),
            tx.pure.string(params.name),
            tx.pure.string(params.avatar),
            tx.pure.string(params.introduction),
            tx.pure.string(params.x),
            tx.pure.string(params.github),
            tx.pure.string(params.email),
            tx.object(networkVariables.version),
            tx.object("0x6"),
        ],
    });
    return tx;
});