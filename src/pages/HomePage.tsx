import { HeroSlider } from '../components/home/HeroSlider';
import { HomeHighlightsSlider } from '../components/home/HomeHighlightsSlider';
import { LatestUpdates } from '../components/home/LatestUpdates';
import { MembershipCTA } from '../components/home/MembershipCTA';
import { SciVerseSection } from '../components/home/SciVerseSection';
import { updates } from '../data/updates';

/**
 * Home — Science Orbit Forum homepage.
 * Section order: Hero Slider → Forum Highlights → Latest News → SciVerse → Membership CTA.
 */
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <HomeHighlightsSlider />
      <LatestUpdates updates={updates} />
      <SciVerseSection articles={updates} />
      <MembershipCTA />
    </>
  );
}

