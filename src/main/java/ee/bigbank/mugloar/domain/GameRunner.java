package ee.bigbank.mugloar.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class GameRunner {

    private static final Logger log = LoggerFactory.getLogger(GameRunner.class);

    private final GameClient client;
    private final SuccessRateTracker successRateTracker;
    private final int runs;

    public GameRunner(GameClient client, SuccessRateTracker successRateTracker, int runs) {
        this.client = client;
        this.successRateTracker = successRateTracker;
        this.runs = runs;
    }

    public void run() {
        List<Integer> scores = playAllGames();
        logSummary(scores);
    }

    private List<Integer> playAllGames() {
        List<Integer> scores = new ArrayList<>();
        for (int runNumber = 1; runNumber <= runs; runNumber++) {
            try {
                GameState finalState = new GameLoop(client, successRateTracker).play();
                scores.add(finalState.score());
                log.info("Run {} finished: score={} level={} turn={}",
                        runNumber, finalState.score(), finalState.level(), finalState.turn());
            } catch (Exception e) {
                log.error("Run {} failed: {}", runNumber, e.getMessage());
            }
        }
        return scores;
    }

    private void logSummary(List<Integer> scores) {
        if (scores.isEmpty()) {
            log.warn("No runs completed.");
            return;
        }

        List<Integer> sorted = scores.stream().sorted().toList();
        int min = sorted.getFirst();
        int median = sorted.get(sorted.size() / 2);
        int max = sorted.getLast();
        log.info("{}/{} runs completed — min={} median={} max={}",
                scores.size(), runs, min, median, max);
    }
}
