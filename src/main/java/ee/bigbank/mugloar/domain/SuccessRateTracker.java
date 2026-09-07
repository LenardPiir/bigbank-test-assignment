package ee.bigbank.mugloar.domain;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;

public class SuccessRateTracker {

    private static final Map<ProbabilityTier, Double> DEFAULT_SUCCESS_RATES = new EnumMap<>(ProbabilityTier.class);
    static {
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.SURE_THING, 0.80);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.PIECE_OF_CAKE, 0.92);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.WALK_IN_THE_PARK, 0.85);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.QUITE_LIKELY, 0.65);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.HMMM, 0.55);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.RISKY, 0.40);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.GAMBLE, 0.40);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.PLAYING_WITH_FIRE, 0.15);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.RATHER_DETRIMENTAL, 0.15);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.SUICIDE_MISSION, 0.03);
        DEFAULT_SUCCESS_RATES.put(ProbabilityTier.IMPOSSIBLE, 0.01);
    }

    private static final int DEFAULT_WEIGHT = 30;
    private static final double DEFAULT_PRIOR = 0.5;

    private final Map<String, Integer> wins = new HashMap<>();
    private final Map<String, Integer> attempts = new HashMap<>();

    public void recordAttempt(ProbabilityTier tier, int level, boolean success) {
        String key = tier + ":" + LevelRange.fromLevel(level);
        attempts.merge(key, 1, Integer::sum);
        if (success) {
            wins.merge(key, 1, Integer::sum);
        }
    }

    public double successRate(ProbabilityTier tier) {
        int totalWins = Arrays.stream(LevelRange.values())
                .mapToInt(bucket -> wins.getOrDefault(tier + ":" + bucket, 0))
                .sum();
        int totalAttempts = Arrays.stream(LevelRange.values())
                .mapToInt(bucket -> attempts.getOrDefault(tier + ":" + bucket, 0))
                .sum();
        double prior = DEFAULT_SUCCESS_RATES.getOrDefault(tier, DEFAULT_PRIOR);
        double weightedWins = totalWins + prior * DEFAULT_WEIGHT;
        double weightedAttempts = totalAttempts + DEFAULT_WEIGHT;
        return weightedWins / weightedAttempts;
    }
}
