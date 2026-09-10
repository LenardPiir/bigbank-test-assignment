package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import java.util.List;

import static ee.bigbank.mugloar.domain.TestFixtures.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AdRankerTest {

    @Test
    void ranksHigherRewardAdFirst() {
        Ad lowReward = aSureThing("1", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);
        Ad highReward = aSureThing("2", A_HIGH_REWARD, A_DEFAULT_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(lowReward, highReward), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(highReward, ranked.get(0));
        assertEquals(lowReward, ranked.get(1));
    }

    @Test
    void saferAdRanksAboveRiskierAdRegardlessOfReward() {
        Ad safe = aSureThing("1", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);
        Ad risky = anAd("2", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.GAMBLE);

        List<Ad> ranked = AdRanker.rank(List.of(risky, safe), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(safe, ranked.getFirst());
    }

    @Test
    void withinSameTierHigherRewardRanksFirst() {
        Ad lowReward = anAd("1", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.HMMM);
        Ad highReward = anAd("2", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.HMMM);

        List<Ad> ranked = AdRanker.rank(List.of(lowReward, highReward), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(highReward, ranked.getFirst());
        assertEquals(lowReward, ranked.get(1));
    }

    @Test
    void prefersSaferAdEvenWhenRiskyAdHasHigherReward() {
        Ad risky = anAd("1", A_HIGH_REWARD, A_URGENT_EXPIRY, ProbabilityTier.SUICIDE_MISSION);
        Ad safe = aSureThing("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(risky, safe), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(safe, ranked.getFirst());
    }

    @Test
    void whenAllAdsAreRiskyPicksSafestTierFirst() {
        Ad worse = anAd("1", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.IMPOSSIBLE);
        Ad better = anAd("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.PLAYING_WITH_FIRE);

        List<Ad> ranked = AdRanker.rank(List.of(worse, better), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(better, ranked.getFirst());
    }

    @Test
    void fallsBackToAllAdsWhenNoneAreAcceptablyRisky() {
        Ad risky1 = anAd("1", A_MEDIUM_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.SUICIDE_MISSION);
        Ad risky2 = anAd("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.IMPOSSIBLE);

        List<Ad> ranked = AdRanker.rank(List.of(risky1, risky2), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(risky1, ranked.getFirst());
    }

    @Test
    void urgencyDoesNotAffectRanking() {
        Ad urgent = aSureThing("1", A_DEFAULT_REWARD, A_URGENT_EXPIRY);
        Ad notUrgent = aSureThing("2", A_DEFAULT_REWARD, A_LONG_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(urgent, notUrgent), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(ranked.get(0).reward(), ranked.get(1).reward());
    }

    @Test
    void scoreIsPositiveForHighSuccessAd() {
        Ad safe = aSureThing("1", A_MEDIUM_REWARD, A_DEFAULT_EXPIRY);

        double score = AdRanker.riskAdjustedScore(safe, aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertTrue(score > 0);
    }

    @Test
    void scoreIsNegativeForNearImpossibleAd() {
        Ad hopeless = anAd("1", A_MEDIUM_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.IMPOSSIBLE);

        double score = AdRanker.riskAdjustedScore(hopeless, aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertTrue(score < 0);
    }

    @Test
    void scoreIsHigherWithMoreLivesForSameAd() {
        Ad ad = aSureThing("1", A_MEDIUM_REWARD, A_DEFAULT_EXPIRY);
        SuccessRateTracker tracker = aSuccessRateTracker();

        double scoreWithFewLives = AdRanker.riskAdjustedScore(ad, tracker, 1);
        double scoreWithManyLives = AdRanker.riskAdjustedScore(ad, tracker, 10);

        assertTrue(scoreWithManyLives > scoreWithFewLives);
    }
}
