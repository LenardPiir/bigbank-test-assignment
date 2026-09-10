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
    private static final int HEAL_BEFORE_QUEST_THRESHOLD = 3;

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
        GameState current = healBeforeQuest(state);

        Ad bestAd = AdRanker.rank(ads, successRateTracker, current.lives()).getFirst();

        GameState stateAfterSolving = solveAd(current, bestAd);

        if (stateAfterSolving.lives() > 0) {
            return attemptToBuyItem(stateAfterSolving);
        }

        return stateAfterSolving;
    }

    private GameState healBeforeQuest(GameState state) {
        if (state.lives() >= HEAL_BEFORE_QUEST_THRESHOLD || state.gold() < HEALING_POTION_COST) {
            return state;
        }
        List<ShopItem> items = client.getShopItems(state.gameId());
        return attemptToBuyHealingPotion(state, items);
    }

    private List<Ad> fetchDecodedAds(GameState state) {
        return client.getAds(state.gameId()).stream()
                .map(AdDecoder::decode)
                .toList();
    }

    private GameState solveAd(GameState state, Ad ad) {
        SolveResult result = client.solve(state.gameId(), ad.adId());
        successRateTracker.recordAttempt(ProbabilityTier.fromLabel(ad.probability()), state.level(), result.success());

        GameState updatedState = state.withSolveResult(result);

        log.debug("Turn {} [{}]: success={} score={} gold={} lives={} level={}",
                updatedState.turn(), ad.probability(), result.success(),
                updatedState.score(), updatedState.gold(), updatedState.lives(), updatedState.level());

        return updatedState;
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
