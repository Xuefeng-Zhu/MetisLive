## Inspiration
Youtube is the most popular video platform, but it is centralized and easily censored. Therefore, it is demanding to create a decentralized and censorship-resistant video platform.

## What it does

MetisLive is a decentralized video and live streaming platform powered by IPFS and NFT on Metis. When content creators upload videos, videos will be stored on IPFS and minted as a NFT. It is censorship-resistant because of IPFS. Content owners will also have strong ownership guarded by NFT. Content owners can also trade and profit from the video content they own. Viewers are able to tip the owners of videos and like/dislike the videos.

## How we built it

MetisLive is built with React and MUI. MetisLive uses NFTPort API to upload video file to IPFS, and mint a NFT on Metis. Since Metis currently does not have index service like Graph, MetisLive reads data through rpc node currently. MetisLive is hosted through 4everland on IPFS.

## Challenges we ran into
It is tricky to create a thumbnail from the browser. I am using canvas to take a snapshot of the video.

## Accomplishments that we're proud of
It is exciting that MetisLive supports the basic most needs of the video platform. It also provides a meaningful way for content creators to earn money besides advertisement.

## What we learned
It is my first time to build a NFT based Dapp. So I learn a lot about NFT and IPFS ecosystem. 

## What's next for MetisLive
Further improve the UI to include a feature like video search, user profile, and subscription. 
