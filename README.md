# ArthroSync (a.k.a Knee-PT)

### How to start

To confirm all node modules and cocoapods are up to date, run the following commands from the _root_ of the React Native project:

```bash
npm install
```

```bash
cd ios && pod install && cd ..
```

To start the app using the iPhone 15 simulator on iOS, run the following command:

```bash
npm run start
```

### Disclaimer

This app is not designed to support Android. Because of this, the `npm run start` script has been modified to start the app in iOS using the iPhone 15 simulator. To start by opening the Metro bundler, you will need to replace the `"start": "react-native run-ios --simulator='iPhone 15'"` script in the `package.json` with `"start": "react-native start"`.
