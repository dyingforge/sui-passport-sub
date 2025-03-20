export default function FAQ() {
    return (
        <div className="flex min-h-screen flex-col items-start px-24 pt-12 bg-[#02101C] text-white">
            <div className="container max-w-[1424px]">
                <h1 className="text-2xl font-bold mb-6">Sui Passport FAQ</h1>

                <div className="space-y-6">
                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q1: What is the Sui Community Passport?</h2>
                        <p>
                            The Sui Community Passport lets members earn stamps and points for their
                            contributions, evolving over time to showcase their engagement and
                            impact in the Sui community.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q2: How do I create a Sui Community Passport?</h2>
                        <ol className="list-decimal pl-6">
                            <li>Visit suipassport.app.</li>
                            <li>Click "Create Passport" and follow the steps to claim available
                                stamps. Some stamps might be password gated, and an action will
                                described to get the password (e.g join a hackathon for example)</li>
                            <li>Once created, your passport will display your earned stamps.</li>
                        </ol>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q3: How do I earn stamps?</h2>
                        <p>
                            You can earn stamps by actively engaging in community activities such as
                            organizing or attending events and meetups, winning a hackathon,
                            becoming an ambassador, or contributing content or development work.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q4: What can I do with my stamps?</h2>
                        <p>
                            At this stage, stamps allow you to showcase your contributions and gain
                            recognition at events as an engaged Sui participant.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q5: Can stamps be transferred or traded?</h2>
                        <p>
                            No, stamps are non-transferable and cannot be traded. They are tied to
                            your passport and reflect your personal contributions.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q6: How will my passport evolve over time?</h2>
                        <p>
                            As you earn more stamps, your passport will visually evolve, showcasing
                            your growing contributions within the Sui ecosystem.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q7: Is there a limit to the number of stamps I can earn?</h2>
                        <p>
                            No, there's no limit! We regularly provide new opportunities to earn
                            stamps by contributing to the community.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q8: How do I check my stamps?</h2>
                        <p>
                            You can find them in your Sui Wallet.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h2 className="text-xl font-semibold mb-2">Q9: Who can I contact for questions?</h2>
                        <p>
                            If you have any questions or run into issues, you can send an email to
                            <a href="mailto:suicommunitypassport@sui.io" className="text-blue-400 hover:text-blue-300 ml-1">
                                suicommunitypassport@sui.io
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}