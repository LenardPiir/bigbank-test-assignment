package ee.bigbank.mugloar;

import ee.bigbank.mugloar.domain.GameRunner;
import ee.bigbank.mugloar.domain.SuccessRateTracker;
import ee.bigbank.mugloar.infrastructure.HttpGameClient;

public class Main {

    private static final int GAME_RUNS = 20;

    public static void main(String[] args) {
        SuccessRateTracker successRateTracker = new SuccessRateTracker();
        new GameRunner(new HttpGameClient(), successRateTracker, GAME_RUNS).run();
    }
}
