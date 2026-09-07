package ee.bigbank.mugloar.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class GameLoop {

    private static final Logger log = LoggerFactory.getLogger(GameLoop.class);
    static final int HEALING_POTION_COST = 50;
    static final int HEALTHY_LIVES = 4;
    private static final String HEALING_POTION = "Healing potion";
    private static final int CRITICAL_LIVES = 1;
    private static final int LOW_LIVES = 2;
    private static final int EARLY_GAME_LEVEL = 3;
    private static final int MID_GAME_LEVEL = 10;

    private final GameClient client;
    private final SuccessRateTracker successRateTracker;

    public GameLoop(GameClient client, SuccessRateTracker successRateTracker) {
        this.client = client;
        this.successRateTracker = successRateTracker;
    }

    public GameState play() {
        GameState state = client.startGame();

        while (state.lives() > 0) {
            List<Ad> ads = fetchDecodedAds(state);
            if (ads.isEmpty()) break;

            state = playTurn(state, ads);
        }

        return state;
    }

    private GameState playTurn(GameState state, List<Ad> ads) {
        List<Ad> safeAds = filterSafeAds(ads, state);
        Ad bestAd = chooseBestAd(ads, safeAds, state);
        double expectedValue = AdRanker.riskAdjustedScore(bestAd, successRateTracker, state.lives());

        if (safeAds.isEmpty() || expectedValue < 0) {
            GameState stateAfterTurnSkip = attemptToSkipTurn(state);
            if (stateAfterTurnSkip.turn() != state.turn()) {
                log.debug("Turn {}: skipping (best EV {})", state.turn(), String.format("%.1f", expectedValue));
                return stateAfterTurnSkip;
            }
        }

        GameState stateAfterSolving = solveAd(state, bestAd, expectedValue);

        if (stateAfterSolving.lives() > 0) {
            return attemptToBuyItem(stateAfterSolving);
        }

        return stateAfterSolving;
    }

    private List<Ad> fetchDecodedAds(GameState state) {
        return client.getAds(state.gameId()).stream()
                .map(AdDecoder::decode)
                .toList();
    }

    private Ad chooseBestAd(List<Ad> ads, List<Ad> safeAds, GameState state) {
        List<Ad> candidates = safeAds.isEmpty() ? ads : safeAds;
        return AdRanker.rank(candidates, successRateTracker, state.lives()).getFirst();
    }

    private List<Ad> filterSafeAds(List<Ad> ads, GameState state) {
        ProbabilityTier maxAllowed = maxAllowedTier(state);
        return ads.stream()
                .filter(ad -> ProbabilityTier.fromLabel(ad.probability()).ordinal() <= maxAllowed.ordinal())
                .toList();
    }

    private GameState solveAd(GameState state, Ad ad, double expectedValue) {
        SolveResult result = client.solve(state.gameId(), ad.adId());
        successRateTracker.recordAttempt(ProbabilityTier.fromLabel(ad.probability()), state.level(), result.success());

        GameState updatedState = state.withSolveResult(result);

        log.debug("Turn {} [{} ev={}]: success={} score={} gold={} lives={} level={}",
                updatedState.turn(), ad.probability(), String.format("%.1f", expectedValue), result.success(),
                updatedState.score(), updatedState.gold(), updatedState.lives(), updatedState.level());

        return updatedState;
    }

    private ProbabilityTier maxAllowedTier(GameState state) {
        if (state.lives() <= CRITICAL_LIVES) return ProbabilityTier.PIECE_OF_CAKE;
        if (state.lives() <= LOW_LIVES) return ProbabilityTier.WALK_IN_THE_PARK;
        if (state.level() < EARLY_GAME_LEVEL) return ProbabilityTier.QUITE_LIKELY;
        if (state.level() < MID_GAME_LEVEL) return ProbabilityTier.GAMBLE;
        return ProbabilityTier.IMPOSSIBLE;
    }

    private GameState attemptToSkipTurn(GameState state) {
        List<ShopItem> items = client.getShopItems(state.gameId());
        int availableGold = state.gold();

        Optional<ShopItem> itemToBuy = bestStatItem(items, availableGold)
                .or(() -> cheapestAffordableItem(items, availableGold));

        return itemToBuy
                .map(item -> buyAndLog(state, item))
                .orElse(state);
    }

    private Optional<ShopItem> cheapestAffordableItem(List<ShopItem> items, int availableGold) {
        return items.stream()
                .filter(shopItem -> shopItem.cost() <= availableGold)
                .min(Comparator.comparingInt(ShopItem::cost));
    }

    private GameState attemptToBuyItem(GameState state) {
        List<ShopItem> items = client.getShopItems(state.gameId());

        GameState afterHealing = state.lives() < HEALTHY_LIVES
                ? attemptToBuyHealingPotion(state, items)
                : state;

        return bestStatItem(items, afterHealing.gold() - HEALING_POTION_COST)
                .map(item -> buyAndLog(afterHealing, item))
                .orElse(afterHealing);
    }

    private GameState attemptToBuyHealingPotion(GameState state, List<ShopItem> items) {
        Optional<ShopItem> potion = items.stream()
                .filter(shopItem -> shopItem.name().equalsIgnoreCase(HEALING_POTION))
                .filter(shopItem -> shopItem.cost() <= state.gold())
                .findFirst();
        return potion.map(item -> buyAndLog(state, item)).orElse(state);
    }

    private Optional<ShopItem> bestStatItem(List<ShopItem> items, int budget) {
        return items.stream()
                .filter(shopItem -> !shopItem.name().equalsIgnoreCase(HEALING_POTION))
                .filter(shopItem -> shopItem.cost() <= budget)
                .max(Comparator.comparingInt(ShopItem::cost));
    }

    private GameState buyAndLog(GameState state, ShopItem item) {
        PurchaseResult result = client.buyItem(state.gameId(), item.id());
        log.debug("Bought {}: level={}, gold={}, lives={}",
                item.name(), result.level(), result.gold(), result.lives());
        return state.withPurchaseResult(result);
    }
}
