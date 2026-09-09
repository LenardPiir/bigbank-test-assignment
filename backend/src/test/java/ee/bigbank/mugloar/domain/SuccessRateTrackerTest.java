package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SuccessRateTrackerTest {

    private final SuccessRateTracker successRateTracker = new SuccessRateTracker();

    @Test
    void returnsDefaultSuccessRateWhenNoAttemptsRecorded() {
        double rate = successRateTracker.successRate(ProbabilityTier.PIECE_OF_CAKE);

        assertEquals(0.92, rate, 0.01);
    }

    @Test
    void successRateIncreasesAfterRecordingWins() {
        double before = successRateTracker.successRate(ProbabilityTier.RISKY);

        for (int i = 0; i < 50; i++) {
            successRateTracker.recordAttempt(ProbabilityTier.RISKY, 10, true);
        }

        double after = successRateTracker.successRate(ProbabilityTier.RISKY);

        assertTrue(after > before);
    }

    @Test
    void successRateDecreasesAfterRecordingFailures() {
        double before = successRateTracker.successRate(ProbabilityTier.PIECE_OF_CAKE);

        for (int i = 0; i < 50; i++) {
            successRateTracker.recordAttempt(ProbabilityTier.PIECE_OF_CAKE, 10, false);
        }

        double after = successRateTracker.successRate(ProbabilityTier.PIECE_OF_CAKE);

        assertTrue(after < before);
    }

    @Test
    void aggregatesAttemptsAcrossAllLevelRanges() {
        successRateTracker.recordAttempt(ProbabilityTier.HMMM, 1, true);
        successRateTracker.recordAttempt(ProbabilityTier.HMMM, 10, true);
        successRateTracker.recordAttempt(ProbabilityTier.HMMM, 25, false);

        double rate = successRateTracker.successRate(ProbabilityTier.HMMM);

        assertEquals(0.56, rate, 0.01);
    }

    @Test
    void moreDataReducesInfluenceOfDefaultRate() {
        for (int i = 0; i < 100; i++) {
            successRateTracker.recordAttempt(ProbabilityTier.GAMBLE, 10, true);
        }

        double rate = successRateTracker.successRate(ProbabilityTier.GAMBLE);

        assertTrue(rate > 0.80);
    }
}
