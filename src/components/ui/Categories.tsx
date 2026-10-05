import type { LucideIcon } from "lucide-react-native";
import {
  Baby,
  Building2,
  Car,
  Eye,
  FileSearch,
  Gavel,
  HardHat,
  HeartHandshake,
  Landmark,
  Laptop,
  MoreHorizontal,
  ScrollText,
  ShieldAlert,
  ShoppingBag,
  Users,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

/* =========================
   Types & data
========================= */

export type LawCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Full Tailwind class (must be a static string), e.g. "bg-blue-600/20" */
  bg: string;
  /** Matching icon colour (hex) */
  color: string;
};

export const LAW_CATEGORIES: LawCategory[] = [
  {
    id: "bns",
    label: "BNS",
    icon: Gavel,
    bg: "bg-blue-600/10",
    color: "#60A5FA",
  },
  {
    id: "bnss",
    label: "BNSS",
    icon: ScrollText,
    bg: "bg-violet-600/10",
    color: "#A78BFA",
  },
  {
    id: "bsa",
    label: "BSA",
    icon: FileSearch,
    bg: "bg-emerald-600/10",
    color: "#34D399",
  },
  {
    id: "constitution",
    label: "Constitution",
    icon: Landmark,
    bg: "bg-amber-600/10",
    color: "#FBBF24",
  },
  {
    id: "human-rights",
    label: "Human Rights",
    icon: HeartHandshake,
    bg: "bg-rose-600/10",
    color: "#FB7185",
  },
  {
    id: "consumer",
    label: "Consumer",
    icon: ShoppingBag,
    bg: "bg-orange-600/10",
    color: "#FB923C",
  },
  {
    id: "cyber",
    label: "Cyber Law",
    icon: Laptop,
    bg: "bg-cyan-600/10",
    color: "#22D3EE",
  },
  {
    id: "motor-vehicles",
    label: "Motor Vehicles",
    icon: Car,
    bg: "bg-red-600/10",
    color: "#F87171",
  },
  {
    id: "family",
    label: "Family",
    icon: Users,
    bg: "bg-pink-600/10",
    color: "#F472B6",
  },
  {
    id: "pocso",
    label: "POCSO",
    icon: Baby,
    bg: "bg-teal-600/10",
    color: "#2DD4BF",
  },
  {
    id: "rti",
    label: "RTI",
    icon: Eye,
    bg: "bg-indigo-600/10",
    color: "#818CF8",
  },
  {
    id: "labour",
    label: "Labour",
    icon: HardHat,
    bg: "bg-yellow-600/10",
    color: "#FACC15",
  },
  {
    id: "property",
    label: "Property",
    icon: Building2,
    bg: "bg-lime-600/10",
    color: "#A3E635",
  },
  {
    id: "women-safety",
    label: "Women Safety",
    icon: ShieldAlert,
    bg: "bg-fuchsia-600/10",
    color: "#E879F9",
  },
];

type Props = {
  categories?: LawCategory[];
  title?: string;
  onSelect: (category: LawCategory) => void;
  onViewMore: () => void;
};

/* =========================
   Tile
========================= */

function Tile({
  label,
  Icon,
  bg,
  color,
  dashed = false,
  onPress,
}: {
  label: string;
  Icon: LucideIcon;
  bg: string;
  color: string;
  dashed?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="w-1/5 items-center px-1 pb-5 active:opacity-60"
    >
      <View
        className={`h-14 w-14 items-center justify-center rounded-2xl ${bg} ${
          dashed ? "border border-dashed border-zinc-600" : ""
        }`}
      >
        <Icon size={24} strokeWidth={1.9} color={color} />
      </View>

      <Text
        numberOfLines={2}
        className="mt-2 min-h-[28px] text-center text-[11px] font-medium leading-[14px] text-zinc-300"
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* =========================
   Component
========================= */

export default function CategoryList({
  categories = LAW_CATEGORIES,
  title,
  onSelect,
  onViewMore,
}: Props) {
  // 5 columns x 3 rows = 15 tiles: 14 categories + the "View more" tile.
  const visible = categories.slice(0, 14);

  return (
    <View className="my-10 ">
      {title ? (
        <Text className="mb-4  text-lg font-bold text-gray-100 mx-4">
          {title}
        </Text>
      ) : null}

      <View className="-mx-1 flex-row flex-wrap">
        {visible.map((item) => (
          <Tile
            key={item.id}
            label={item.label}
            Icon={item.icon}
            bg={item.bg}
            color={item.color}
            onPress={() => onSelect(item)}
          />
        ))}

        <Tile
          label="View more"
          Icon={MoreHorizontal}
          bg="bg-zinc-800/60"
          color="#A1A1AA"
          dashed
          onPress={onViewMore}
        />
      </View>
    </View>
  );
}
