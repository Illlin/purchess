## Inspiration

As can be seen by our close to 2000 chess games against each other on Lichess, we quite like chess. There are lots of existing chess variations of course, with all sorts of unusual features, but there's no simple way for standard people to create their own arbitrary variations easily.

In this project we designed and implemented a Python-based chess server API, with a fully parameterised model for infinite possibilities of a generic class of chess pieces, as well as an intuitive and user friendly web-based chess experience making use of this API.

As a whole, we call this project "Purche$$", cleverly combining the words "Purchase" and "Chess". Our original plan was to implement upgrade trees and a mechanic where players can _purchase_ pieces to use in a game with a set budget.

## Chess Generalisation

We looked at existing chess pieces and considered other types that we want to implement, and generalised their behaviour into a small set of parameters which can easily apply to every standard chess piece and an infinite set of custom ones. These parameters are:

 - movements; a list of movement "arms", where each arm is represented by a constant offset, a value for how many times this offset may be applied to reach the destination (in [1, ∞]), and a value specifying whether the piece is allowed to "jump" over other pieces on its journey here, or if it's instead stopped by them.
 - knightlike; whether or not the piece behaves like a knight. If this is true, an additional two parameters 'a' and 'b' are specified, which represent the two side lengths of the L shape that a knight-like piece will take. Knight like pieces can implicitly jump over other pieces. The knightlike parameter can be seen as an abstraction wrapper around the movements parameter, since technically any knightlike piece can be represented purely in movements.

## Setups and Games

Under normal chess rules, every game starts the same way. In Purche$$ we maintain a database of named setups, using any combination of our custom defined pieces. When a user wants to create a game, they simply need to choose a username, pick a setup, and press play. There's a nice preview of the setup as you hover over each option, and you can pick which side you want to play on.

Once a game is created, the next person to go to its URL will play you! It's a fight to the death; there is no "checkmate", you have to actually take your opponent's king!

## How we built it

### Frontend

We used NextJS and React to make a modern clean UI that would be easy to deploy after the hackathon. As this is a project we have wanted to work on for a while, polishing it now was well worth the effort!

### Backend

We wrote the backend API as a Python application using Flask. We provide a well-defined REST-ish API.
The API provides a simple interface between the web application and an underlying chess representation made up of a Board class which models an ongoing game instance, and Piece subclasses.

## Challenges we ran into

One major problem was working out the best way to receive enough updates to the game state through the API. 

## Accomplishments that we're proud of

- Creating a functional website with multiplayer functionality.
- Recreating the mechanics of Chess in Python, with our own additions.
- Designing and fleshing out several new exciting chess pieces such as the shaman and the cardinal.
- Successful integration of front end and back end.
- Working as a team to create a shared vision.

## What we learned

We learned, or perhaps rediscovered, the woes of integrating an API to a frontend.

## What's next for Purche$$

Due to time limitations, we weren't able to fully finish every feature that we intended from the start.

We would love to:
 - Implement a fully working chess, rather than a decent subset as it is now. Castling and **EN PASSANT** would be nice.
 - Upgrade trees, where players can progress through different classes of piece.
 - A budget per game, where players can create their own layout pregame based on a configured budget.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
