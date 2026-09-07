package ee.bigbank.mugloar.domain;

import java.util.Comparator;
import java.util.List;

class AdRanker {

    static List<Ad> rank(List<Ad> ads, SuccessRateTracker successRateTracker, int lives) {
        return ads.stream()
                .sorted(Comparator.comparingDouble((Ad ad) -> riskAdjustedScore(ad, successRateTracker, lives)).reversed())
                .toList();
    }

    static double riskAdjustedScore(Ad ad, SuccessRateTracker successRateTracker, int lives) {
        ProbabilityTier tier = ProbabilityTier.fromLabel(ad.probability());
        double successProbability = successRateTracker.successRate(tier);
        double urgency = ad.expiresIn() <= 0 ? 1.0 : ad.expiresIn();

        double lifeCost = (double) GameLoop.HEALING_POTION_COST * GameLoop.HEALTHY_LIVES / Math.max(1, lives);

        return (ad.reward() * successProbability - lifeCost * (1 - successProbability)) / urgency;
    }
}
