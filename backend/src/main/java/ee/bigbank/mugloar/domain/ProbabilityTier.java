package ee.bigbank.mugloar.domain;

import java.util.Arrays;

public enum ProbabilityTier {
    SURE_THING("Sure thing"),
    PIECE_OF_CAKE("Piece of cake"),
    WALK_IN_THE_PARK("Walk in the park"),
    QUITE_LIKELY("Quite likely"),
    HMMM("Hmmm...."),
    RISKY("Risky"),
    GAMBLE("Gamble"),
    PLAYING_WITH_FIRE("Playing with fire"),
    RATHER_DETRIMENTAL("Rather detrimental"),
    SUICIDE_MISSION("Suicide mission"),
    IMPOSSIBLE("Impossible");

    final String label;

    ProbabilityTier(String label) {
        this.label = label;
    }

    static ProbabilityTier fromLabel(String label) {
        return Arrays.stream(values())
                .filter(t -> t.label.equalsIgnoreCase(label))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown probability label: " + label));
    }
}
