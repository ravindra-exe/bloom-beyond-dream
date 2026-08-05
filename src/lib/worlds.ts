import worldCrystal from "@/assets/world-crystal.jpg";
import worldMoonlight from "@/assets/world-moonlight.jpg";
import worldSky from "@/assets/world-sky.jpg";
import worldOcean from "@/assets/world-ocean.jpg";
import worldGolden from "@/assets/world-golden.jpg";
import videoCrystal from "@/assets/world-crystal.mp4.asset.json";
import videoMoonlight from "@/assets/world-moonlight.mp4.asset.json";
import videoSky from "@/assets/world-sky.mp4.asset.json";
import videoOcean from "@/assets/world-ocean.mp4.asset.json";
import videoGolden from "@/assets/world-golden.mp4.asset.json";

export type WorldTone = "light" | "dark" | "gold" | "ocean" | "sky";
export type LivingLayer = "clouds" | "birds" | "dust" | "pollen" | "bubbles" | "embers";

export type WanderChapter = {
  label: string;
  title: string;
  body: string;
};

export type World = {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video: string;
  tone: WorldTone;
  longText: string;
  accent: string;
  accentSoft: string;
  bgTint: string;
  living: LivingLayer[];
  butterflyColors: string[];
  quote: string;
  quoteSource: string;
  wander: WanderChapter[];
};

export const worlds: World[] = [
  {
    id: "crystal",
    chapter: "Chapter I",
    title: "The Crystal Bloom",
    subtitle: "Frozen Starlight",
    description:
      "A world carved from frozen starlight, where petals chime like fine glass in the wind and refract entire galaxies into a single drop of dew.",
    image: worldCrystal,
    video: videoCrystal.url,
    tone: "light",
    accent: "#9FC7E8",
    accentSoft: "#DCEBFB",
    bgTint: "linear-gradient(180deg, #0a1830 0%, #1d3a66 60%, #5d8fc7 100%)",
    living: ["dust", "pollen"],
    butterflyColors: ["#9FC7E8", "#DCEBFB", "#FFFFFF", "#B8D9F0"],
    longText:
      "Step inside a cathedral of ice. Every petal here was once a fallen star, slowed to a glassy hush by the long winter. Walk carefully — the bloom remembers the songs you hum.",
    quote: "Cold is not the absence of warmth, but the long memory of light.",
    quoteSource: "Glaciologist's prayer, Vault of the Crystal Bloom",
    wander: [
      {
        label: "I · The Hush",
        title: "Where sound becomes ice.",
        body: "Visitors lower their voices without knowing why. Every word freezes into a small bell that the wind plays back, weeks later, as a song you'll swear you wrote.",
      },
      {
        label: "II · The Refraction",
        title: "Galaxies inside a single dewdrop.",
        body: "Kneel before any bloom and look through the rim of its lowest petal. The galaxy you see is not metaphor — it is the same sky, slowed by a hundred million years of cold.",
      },
      {
        label: "III · The Thaw That Never Comes",
        title: "Winter as devotion.",
        body: "Spring tried to enter once. It left a single warm footprint, now framed in glass, still steaming faintly. The garden chose its season and has not regretted it.",
      },
    ],
  },
  {
    id: "moonlight",
    chapter: "Chapter II",
    title: "The Moonlight Orchid",
    subtitle: "Bioluminescent Night",
    description:
      "Petals glow softly as fireflies drift through clouds of luminous pollen. Here the night does not fall — it blooms.",
    image: worldMoonlight,
    video: videoMoonlight.url,
    tone: "dark",
    accent: "#C6A8FF",
    accentSoft: "#E8DCFF",
    bgTint: "linear-gradient(180deg, #0b0820 0%, #1d1240 55%, #4a2a8a 100%)",
    living: ["pollen", "embers"],
    butterflyColors: ["#C6A8FF", "#E8DCFF", "#8B6BD9", "#FFD9F0"],
    longText:
      "The orchids open only when watched. Pollen rises in spirals of cool light, painting the dark with constellations no astronomer has ever charted.",
    quote: "We do not fear the dark — we are simply the part of it that learned to glow.",
    quoteSource: "Inscription, the Lantern Gate of Moonlight Orchid",
    wander: [
      {
        label: "I · The Watching",
        title: "Bloom requires a witness.",
        body: "Look away and the orchid folds. Look back, and it is twice as open. Some say the flower borrows the act of seeing — and gives it back as light.",
      },
      {
        label: "II · The Pollen Constellations",
        title: "Star maps that drift instead of turn.",
        body: "On warm nights the pollen organizes itself into shapes no one has named. Old visitors swear they have seen their own faces, drawn in slow violet sparks, fifty feet above the path.",
      },
      {
        label: "III · The Fireflies' Council",
        title: "A parliament that meets at dusk.",
        body: "At the third hour after sunset the fireflies gather in a ring. Whatever is decided there cannot be undone before dawn — even the orchids defer.",
      },
    ],
  },
  {
    id: "sky",
    chapter: "Chapter III",
    title: "The Sky Daisy",
    subtitle: "Above the Clouds",
    description:
      "A flower that grew so tall it pierced the horizon. Floating islands, butterflies, and a wind that tastes of summer.",
    image: worldSky,
    video: videoSky.url,
    tone: "sky",
    accent: "#FFD7C2",
    accentSoft: "#FFF1E8",
    bgTint: "linear-gradient(180deg, #f5d4e0 0%, #c9d8f5 55%, #fff4e3 100%)",
    living: ["clouds", "birds"],
    butterflyColors: ["#FFD7C2", "#FEECE9", "#C9D8F5", "#FFB89B"],
    longText:
      "Climb the stem until the world becomes a quilt of cloud. Butterflies the size of kites carry small wishes from horizon to horizon, never landing.",
    quote: "Up here the wind is older than the earth — it remembers being only sky.",
    quoteSource: "Aeronaut's letter, written above the Sky Daisy",
    wander: [
      {
        label: "I · The Stem That Pierces",
        title: "A flower taller than weather.",
        body: "The stem grows through three layers of cloud and one of myth. Climbers report passing flocks of birds that have never seen the ground and have no word for it.",
      },
      {
        label: "II · The Wish-Bearers",
        title: "Butterflies the size of kites.",
        body: "They never land — landing would mean choosing a single horizon. Instead they carry small wishes from one edge of the sky to the other, releasing them only when the wind agrees.",
      },
      {
        label: "III · The Quilt of Cloud",
        title: "A ground that forgives footprints.",
        body: "Step softly. The cloud-quilt holds you only as long as you believe you are weightless. Most visitors learn this twice.",
      },
    ],
  },
  {
    id: "abyss",
    chapter: "Chapter IV",
    title: "The Abyssal Rose",
    subtitle: "Deep Sea Flora",
    description:
      "A floral kingdom that breathes saltwater, where coral and orchid become one and the light arrives in slow, cathedral beams.",
    image: worldOcean,
    video: videoOcean.url,
    tone: "ocean",
    accent: "#7BE6FF",
    accentSoft: "#C8F4FF",
    bgTint: "linear-gradient(180deg, #03132e 0%, #062a55 55%, #0b4a82 100%)",
    living: ["bubbles", "pollen"],
    butterflyColors: ["#7BE6FF", "#C8F4FF", "#5BB8D9", "#FF8FB8"],
    longText:
      "Sink past the thermocline and the garden begins. Coral petals open like lungs; bioluminescent pollen drifts on a current that has not changed direction in ten thousand years.",
    quote: "Salt is the slowest perfume — it takes a thousand years to fully bloom.",
    quoteSource: "Tide-keeper's log, the Abyssal Rose",
    wander: [
      {
        label: "I · The Thermocline",
        title: "A door made of temperature.",
        body: "Below a certain warmth the rules of the garden change. Light bends differently, breath becomes ceremony, and your shadow arrives a half-second after you.",
      },
      {
        label: "II · The Coral Lung",
        title: "Petals that breathe in saltwater.",
        body: "Each rose opens in time with a single ancient tide. Place your hand near one and you will feel a slow, surprised inhale — as if the flower had not expected company today.",
      },
      {
        label: "III · The Unturning Current",
        title: "A river inside the sea.",
        body: "One pale current threads the entire kingdom. It has flowed in the same direction since long before the moon was tame. The pollen rides it like a procession.",
      },
    ],
  },
  {
    id: "golden",
    chapter: "Chapter V",
    title: "Eternal Solstice",
    subtitle: "Liquid Gold",
    description:
      "Bask in the warmth of a sun that never sets, where every leaf is spun from pure liquid gold and the air is thick with pollen.",
    image: worldGolden,
    video: videoGolden.url,
    tone: "gold",
    accent: "#E8B85C",
    accentSoft: "#F8E2A8",
    bgTint: "linear-gradient(180deg, #3a1d05 0%, #8a4d12 55%, #f0c46a 100%)",
    living: ["embers", "dust"],
    butterflyColors: ["#E8B85C", "#F8E2A8", "#FFD56B", "#B38B5D"],
    longText:
      "Time pools here like honey. Every leaf catches the long light and gives it back tenfold. You will not notice the hours pass; you will only notice that you have become warmer.",
    quote: "Warmth is a kind of patience the sun has practiced for an eternity.",
    quoteSource: "Sundial inscription, Eternal Solstice",
    wander: [
      {
        label: "I · The Long Light",
        title: "A sun that never sets.",
        body: "Noon here is not a moment but a climate. Shadows soften until they are merely suggestions, and the day takes its leisure in your bones.",
      },
      {
        label: "II · Liquid Leaves",
        title: "Foliage spun from gold.",
        body: "Each leaf catches the light and gives back tenfold — but it asks nothing in return except that you stand still for a moment longer than you meant to.",
      },
      {
        label: "III · The Honey Hour",
        title: "Where time pools instead of passing.",
        body: "Visitors often arrive briefly and leave decades later, unchanged. The garden does not steal time. It simply gives you somewhere kind to leave it.",
      },
    ],
  },
];

const worldsById = new Map(worlds.map((w) => [w.id, w]));

export const getWorld = (id: string) => worldsById.get(id);
