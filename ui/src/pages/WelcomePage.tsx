import PageContainer from "./PageContainer";
import "../App.css";

export const WelcomePage: React.FC = () => {
  return (
    <PageContainer>
      <div className="welcome-page">
        <div className="welcome-title">Pokemon Comparator</div>
        <div>
          The pokemon comparator will pit the pokemon of your choice against
          each other to determine which might have a higher success rate in
          battle. The prediction calculated is solely statistically based and
          does not take into account game RNG (random number generator - or
          luck!) Or individual moves a pokemon can perform which may enhance
          their battle stats momentarily. Sure, we could calculate using the
          game's mechanics, which pokemon would be guaranteed to succeed,
          because what's the fun in that?
        </div>
        <br />
        <div>
          Additionally, the calculator does not take into account the current
          level of individual pokemon. All comparisons are made at the same
          level/base stats.
        </div>
        <br />
        <div>
          Natural assumptions can be inferred based upon a level disparity
          between two pokemon, but this tool can still be used to supply context
          on the feasibility of a particular matchup, nevertheless.
        </div>
        <br />
        <div>
          Finally, battle data is derived from the “I attack you” point of view.
          Success rates are determined by comparing both the “I attack you”
          points of view of the matchup in addition to statistic comparison.{" "}
        </div>
      </div>
    </PageContainer>
  );
};
