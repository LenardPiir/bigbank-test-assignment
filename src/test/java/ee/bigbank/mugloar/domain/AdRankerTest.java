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
    void whenRewardsAreEqualAdExpiringSoonerRanksFirst() {
        Ad expiresLater = aSureThing("1", A_DEFAULT_REWARD, A_LONG_EXPIRY);
        Ad expiresSooner = aSureThing("2", A_DEFAULT_REWARD, A_URGENT_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(expiresLater, expiresSooner), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(expiresSooner, ranked.get(0));
        assertEquals(expiresLater, ranked.get(1));
    }

    @Test
    void ranksByUrgencyWeightedScoreRatherThanRewardAlone() {
        Ad highRewardButNotUrgent = aSureThing("1", A_MEDIUM_REWARD, A_LONG_EXPIRY);
        Ad lowRewardButUrgent = aSureThing("2", A_DEFAULT_REWARD, A_URGENT_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(highRewardButNotUrgent, lowRewardButUrgent), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(lowRewardButUrgent, ranked.get(0));
        assertEquals(highRewardButNotUrgent, ranked.get(1));
    }

    @Test
    void adsExpiringThisTurnRankAboveEverythingElse() {
        Ad expiringNow = aSureThing("1", A_MEDIUM_REWARD, A_IMMEDIATE_EXPIRY);
        Ad notUrgent = aSureThing("2", A_MEDIUM_REWARD, A_LONG_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(notUrgent, expiringNow), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(expiringNow, ranked.get(0));
        assertEquals(notUrgent, ranked.get(1));
    }

    @Test
    void whenMultipleAdsExpireThisTurnHigherRewardRanksFirstAmongThem() {
        Ad expiringNowLowReward = aSureThing("1", A_DEFAULT_REWARD, A_IMMEDIATE_EXPIRY);
        Ad expiringNowHighReward = aSureThing("2", A_HIGH_REWARD, A_IMMEDIATE_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(expiringNowLowReward, expiringNowHighReward), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(expiringNowHighReward, ranked.get(0));
        assertEquals(expiringNowLowReward, ranked.get(1));
    }

    @Test
    void saferAdRanksAboveRiskierAdWhenUrgencyScoresAreEqual() {
        Ad safe = aSureThing("1", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);
        Ad risky = anAd("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.GAMBLE);

        List<Ad> ranked = AdRanker.rank(List.of(safe, risky), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(safe, ranked.getFirst());
    }

    @Test
    void fallsBackToAllAdsWhenNoneAreAcceptablyRisky() {
        Ad risky1 = anAd("1", A_MEDIUM_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.SUICIDE_MISSION);
        Ad risky2 = anAd("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.IMPOSSIBLE);

        List<Ad> ranked = AdRanker.rank(List.of(risky1, risky2), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(risky1, ranked.getFirst());
    }

    @Test
    void whenAllAdsAreRiskyPicksLeastRiskyRatherThanHighestReward() {
        Ad worseRiskHigherUrgency = anAd("1", A_HIGH_REWARD, A_URGENT_EXPIRY, ProbabilityTier.IMPOSSIBLE);
        Ad betterRiskLowerUrgency = anAd("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.PLAYING_WITH_FIRE);

        List<Ad> ranked = AdRanker.rank(List.of(worseRiskHigherUrgency, betterRiskLowerUrgency), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(betterRiskLowerUrgency, ranked.getFirst());
    }

    @Test
    void prefersSaferAdEvenWhenRiskyAdHasHigherUrgency() {
        Ad risky = anAd("1", A_MEDIUM_REWARD, A_URGENT_EXPIRY, ProbabilityTier.SUICIDE_MISSION);
        Ad safe = aSureThing("2", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);

        List<Ad> ranked = AdRanker.rank(List.of(risky, safe), aSuccessRateTracker(), A_DEFAULT_LIVES);

        assertEquals(safe, ranked.getFirst());
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

    @Test
    void urgentAdScoresHigherThanIdenticalNonUrgentAd() {
        Ad urgent = aSureThing("1", A_MEDIUM_REWARD, A_URGENT_EXPIRY);
        Ad relaxed = aSureThing("2", A_MEDIUM_REWARD, A_LONG_EXPIRY);
        SuccessRateTracker tracker = aSuccessRateTracker();

        double urgentScore = AdRanker.riskAdjustedScore(urgent, tracker, A_DEFAULT_LIVES);
        double relaxedScore = AdRanker.riskAdjustedScore(relaxed, tracker, A_DEFAULT_LIVES);

        assertTrue(urgentScore > relaxedScore);
    }
}
