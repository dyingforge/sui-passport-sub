import ReactMarkdown from 'react-markdown';

export default function FAQ() {
    const markdown = `
**Sui Passport FAQ**

**Q1: What is the Sui Community Passport?**

The Sui Community Passport lets members earn stamps and points for their
contributions, evolving over time to showcase their engagement and
impact in the Sui community.

**Q2: How do I create a Sui Community Passport?**

1.  Visit suipassport.app.

2.  Click "Create Passport" and follow the steps to claim available
    stamps. Some stamps might be password gated, and an action will
    described to get the password (e.g join a hackathon for example)

3.  Once created, your passport will display your earned stamps.

**Q3: How do I earn stamps?**

You can earn stamps by actively engaging in community activities such as
organizing or attending events and meetups, winning a hackathon,
becoming an ambassador, or contributing content or development work.

**Q4: What can I do with my stamps?**

At this stage, stamps allow you to showcase your contributions and gain
recognition at events as an engaged Sui participant.

**Q5: Can stamps be transferred or traded?**

No, stamps are non-transferable and cannot be traded. They are tied to
your passport and reflect your personal contributions.

**Q6: How will my passport evolve over time?**

As you earn more stamps, your passport will visually evolve, showcasing
your growing contributions within the Sui ecosystem.

**Q7: Is there a limit to the number of stamps I can earn?**

No, there's no limit! We regularly provide new opportunities to earn
stamps by contributing to the community.

**Q8: How do I check my stamps?**

You can find them in your Sui Wallet.

**Q9: Who can I contact for questions?**

If you have any questions or run into issues, you can send an email to
suicommunitypassport@sui.io`;

    return (
        <div className="flex min-h-screen flex-col items-start px-24 pt-12 bg-[#02101C] text-white">
            <div className="container max-w-[1424px]">
                <ReactMarkdown>
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    )
}