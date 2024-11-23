# essence-frontend


## Setup

**Use latest version of node 21+ and npm 10+**

Run these commands

`npm install`

**To run locally**

Create local file `.env.local` in root and add the environment variables

EXPO_PUBLIC_ESSENCE_REST_API_URL=API_URL 

eg: `https://mkhg9ap0r7.execute-api.us-east-1.amazonaws.com`

`npm start`
and once its running, press `w` for web version

**To build for web**

`npm run build:web`

**To build for APK**

`npm run build:apk`

You will need EAS credentials for this.

**To preview build**

`npx serve build`
