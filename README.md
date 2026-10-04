# KanunMitra

KanunMitra is a cross-platform mobile app built with Expo, React Native, TypeScript, and Expo Router.

## Requirements

- Node.js 24 LTS (`.nvmrc` and `.node-version` are set to `24`)
- npm

Install or switch to Node 24 with your version manager, then install dependencies:

```sh
nvm install 24
nvm use 24
npm ci
```

## Start the app

```sh
npm start
```

Use the Expo CLI options to open the project on Android, iOS, or web. The iOS simulator requires macOS.

## Styling and icons

- NativeWind 4.2 with Tailwind CSS 3.4 provides utility classes for React Native.
- `lucide-react-native` provides SVG icons; import icons from the package and use them as React components.
- Shared screen routes live in `src/app/`; import `src/global.css` from the root layout.

Example:

```tsx
import { Search } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function SearchButton() {
  return (
    <View className="flex-row items-center gap-2">
      <Search size={20} color="#334155" />
      <Text className="text-slate-700">Search</Text>
    </View>
  );
}
```
