package ee.bigbank.mugloar.domain;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

class FakeGameClient implements GameClient {
    private final GameState startState;
    private final Queue<List<Ad>> adBatches = new LinkedList<>();
    private final Queue<SolveResult> solveResults = new LinkedList<>();

    final List<String> solvedAdIds = new ArrayList<>();
    private List<ShopItem> shopItems = List.of();
    final List<String> purchasedItemIds = new ArrayList<>();
    boolean shopWasQueried = false;

    FakeGameClient(GameState startState) {
        this.startState = startState;
    }

    void queueAdBatch(List<Ad> ads) {
        adBatches.add(ads);
    }

    void queueSolveResult(SolveResult result) {
        solveResults.add(result);
    }

    void setShopItems(List<ShopItem> items) {
        this.shopItems = items;
    }

    @Override
    public GameState startGame() {
        return startState;
    }

    @Override
    public List<Ad> getAds(String gameId) {
        return adBatches.isEmpty() ? List.of() : adBatches.poll();
    }

    @Override
    public SolveResult solve(String gameId, String adId) {
        solvedAdIds.add(adId);
        return solveResults.poll();
    }

    @Override
    public List<ShopItem> getShopItems(String gameId) {
        shopWasQueried = true;
        return shopItems;
    }

    @Override
    public PurchaseResult buyItem(String gameId, String itemId) {
        purchasedItemIds.add(itemId);
        return new PurchaseResult(true, 0, 1, 1, 1);
    }
}
