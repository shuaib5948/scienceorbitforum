import { HeroSection } from '../components/home/HeroSection';
import { HomeHighlightsSlider } from '../components/home/HomeHighlightsSlider';
import { LatestUpdates } from '../components/home/LatestUpdates';
import { MembershipCTA } from '../components/home/MembershipCTA';
import { SciVerseSection } from '../components/home/SciVerseSection';
import { updates } from '../data/updates';

/**
 * Home — Science Orbit Forum homepage.
 * Section order: Hero → Forum Highlights → Latest News → SciVerse → Membership CTA.
 */
export default function HomePage() {
  const latestUpdates = updates.slice(0, 4);

  return (
    <>
      <HeroSection />
      <HomeHighlightsSlider />
      <LatestUpdates updates={latestUpdates} />
      <SciVerseSection articles={updates.slice(0, 3)} />
      <MembershipCTA />
    </>
  );
}

