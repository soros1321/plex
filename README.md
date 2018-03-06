<img src="https://s3-us-west-2.amazonaws.com/dharma-assets/logo+orange.png"  width=300/>

------------
# Bazaar

Codename for MVP Order Generation / Filling / Dashboard DApp

## Setup
Install dependencies:
```
yarn
```

Run local test chain:
```
yarn chain
```

Compile & migrate contracts:
```
yarn contracts:compile && yarn contracts:migrate
```

Pre-populate the app with some test loans data:
```
yarn migrations:loans
```

## How to set up `ngrok` environment locally
1. To begin development you first need to install the app dependencies `yarn install`.
2. Run `yarn ngrok:start` to start ngrok.
3. Copy the ngrok forwarding route that looks something like `https://00434830.ngrok.io` to your `.env` file. Your `.env` is located in your project root directory.
4. Update the `REACT_APP_NGROK_HOSTNAME` variable with the route above and save the `.env` file.
5. Run `yarn start`.
