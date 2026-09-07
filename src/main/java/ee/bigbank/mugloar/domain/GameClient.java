package ee.bigbank.mugloar.domain;

import java.util.List;

public interface GameClient {
    GameState startGame();
    List<Ad> getAds(String gameId);
    SolveResult solve(String gameId, String adId);
    List<ShopItem> getShopItems(String gameId);
    PurchaseResult buyItem(String gameId, String itemId);
}
