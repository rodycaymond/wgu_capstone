import PageContainer from "./PageContainer";
import "../App.css";

export const WelcomePage: React.FC = () => {
  return (
    <PageContainer>
      <div className="welcome-page">
        <div className="welcome-title">Pokemon Battle Predictor</div>
        <div>
          The Pokemon Battle Predictor will pit the Pokemon of your choice
          against each other to determine which might have a higher success rate
          in battle. The prediction calculated is generated from an AI Model
          which executes a decision tree to determine which moves to use in
          battle. You, as the Pokemon trainer, are given the opportunity to
          select a Pokemon and its move set to see how different permutations of
          actions might affect the outcome of the battle. Target Pokemon moves
          are chosen at random, once, after you have selected the Pokemon. It is
          possible that the move set randomly selected might have moves that do
          no damage. If you think you selected a no-damage target Pokemon,
          simply reset the Pokemon for a different move set.
        </div>
        <br />
        <div>
          The goal of this application is to leverage Machine Learning to
          provide Pokemon battle insights for users who wish to have a higher
          chance of success in their own battles. The intentions were not to
          re-code the Pokemon battle mechanics, so several liberties were taken.
          The mechanics are still mathematically based on real Pokemon battle
          mechanics, however. The results produced are mostly accurate with the
          liberties taken into consideration.
        </div>
        <br />
        <div>
          Additionally, the calculator does not take into account the current
          level of individual Pokemon. All comparisons are made at the same
          level/base stats.
        </div>
        <br />
        <div>
          Natural assumptions can be inferred based upon a level disparity
          between two Pokemon, but this tool can still be used to supply context
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
