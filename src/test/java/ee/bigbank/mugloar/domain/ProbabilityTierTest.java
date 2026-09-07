package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProbabilityTierTest {

    @Test
    void mapsKnownLabelToCorrectTier() {
        assertEquals(ProbabilityTier.SURE_THING, ProbabilityTier.fromLabel("Sure thing"));
        assertEquals(ProbabilityTier.RATHER_DETRIMENTAL, ProbabilityTier.fromLabel("Rather detrimental"));
    }

    @Test
    void throwsOnUnknownLabel() {
        assertThrows(IllegalArgumentException.class, () -> ProbabilityTier.fromLabel("Certain doom"));
    }
}
