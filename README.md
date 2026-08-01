# Environteers

A React Native app built with Expo for Environteers, a Santa Cruz County environmental nonprofit. Users can browse and sign up for volunteer opportunities, track their activity, earn achievements, find opportunities on a map, and stay informed with local environmental news.

## Setup
1. Install dependencies:
```bash
   npm install
```

2. Create a `.env` file in the project root with the following variables:
```
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
   EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=
```

3. This app uses deep linking for authentication which is not supported in Expo Go. You must run a development build on a physical device or simulator. For setting up an iOS simulator, see [Xcode](https://developer.apple.com/documentation/safari-developer-tools/installing-xcode-and-simulators), and for setting up an Android simulator, see [Android Studio](https://developer.android.com/courses/pathways/android-basics-compose-unit-1-pathway-2).

## Running the App

### iOS Simulator

```bash
npx expo run:ios
```

### Android

```bash
npx expo run:android
```

Then start the dev server if it doesn't start automatically:
```bash
npx expo start --dev-client
```

## Production Build

Requires an [Expo account](https://expo.dev) and EAS CLI:
```bash
npm install -g eas-cli
eas login
```

Build and submit:
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```
