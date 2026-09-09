package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LevelRangeTest {

    @Test
    void levelsBelowFiveAreLow() {
        assertEquals(LevelRange.LOW, LevelRange.fromLevel(0));
        assertEquals(LevelRange.LOW, LevelRange.fromLevel(4));
    }

    @Test
    void levelsFiveToNineteenAreMid() {
        assertEquals(LevelRange.MID, LevelRange.fromLevel(5));
        assertEquals(LevelRange.MID, LevelRange.fromLevel(19));
    }

    @Test
    void levelsTwentyAndAboveAreHigh() {
        assertEquals(LevelRange.HIGH, LevelRange.fromLevel(20));
        assertEquals(LevelRange.HIGH, LevelRange.fromLevel(50));
    }
}
