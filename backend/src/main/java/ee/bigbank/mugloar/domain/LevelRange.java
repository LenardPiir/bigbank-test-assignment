package ee.bigbank.mugloar.domain;

enum LevelRange {
    LOW(0),
    MID(5),
    HIGH(20);

    private final int minLevel;

    LevelRange(int minLevel) {
        this.minLevel = minLevel;
    }

    static LevelRange fromLevel(int level) {
        if (level >= HIGH.minLevel) return HIGH;
        if (level >= MID.minLevel) return MID;
        return LOW;
    }
}
