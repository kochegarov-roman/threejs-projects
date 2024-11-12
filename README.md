This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Projects using the library are collected here [threejs](https://threejs.org/)

Some components are assembled using [shadcn](https://ui.shadcn.com/)

To display statistics, use the query parameter - ?stats=1

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**node/20.18.0**

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [https://threejs.org/](https://threejs.org/) - three.js documentation

### ffmpeg commands for video
- ffmpeg -i custom.mov -c:v mpeg2video -c:a mp2 custom.mpeg
- ffmpeg -i custom.mpeg -c:v libx264 -c:a aac -strict experimental custom.mp4
