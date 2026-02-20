This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODO
- be able to hook it up with AI to generate motivational quote
- add API to grab motivational quote
- be able to save motivational quote
- add login (3rd party) for it
- maybe....be able to save all messages to AI on the mood
- https://railway.com/?referralCode=whitetown ; use railway for deployment?

https://www.reddit.com/r/nextjs/comments/1ff1mq0/which_free_postgres_database_provider_to_choose/
note to self: if i ever scale up. go with Neon or Supabase for DB

go with supabase because it provides more things out of the hood:
https://www.reddit.com/r/PostgreSQL/comments/1autrr5/comment/krcv05b/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button ; i like how it provides file storage and auth (i would need auth to store info on db as a indentifier
)


https://engineering.teknasyon.com/next-js-with-supabase-google-login-step-by-step-guide-088ef06e0501




https://www.reddit.com/r/devops/comments/105a2bn/comment/j3c5pej/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
- will go with Github actions because my code is hosted on Github and seeing how the knowledge and skill is transferrable between Gitlab and GitHub