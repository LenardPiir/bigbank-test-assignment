package ee.bigbank.mugloar.domain;

import java.util.List;

final class TestFixtures {

    static final String A_DEFAULT_GAME_ID = "g1";
    static final String A_DEFAULT_MESSAGE = "Do a thing";
    static final int A_IMMEDIATE_EXPIRY = 0;
    static final int A_URGENT_EXPIRY = 1;
    static final int A_DEFAULT_EXPIRY = 5;
    static final int A_LONG_EXPIRY = 10;
    static final int A_DEFAULT_LIVES = 3;
    static final int A_DEFAULT_REWARD = 50;
    static final int A_MEDIUM_REWARD = 100;
    static final int A_HIGH_REWARD = 500;

    static final Ad A_SURE_THING_AD = aSureThing("a1", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);
    static final Ad A_BASE64_ENCRYPTED_AD = new Ad(
            "V2RaOW1sem8=",
            "SW5maWx0cmF0ZSBUaGUgR3JpenpseSBHb3JpbGxhcyBhbmQgcmVjb3ZlciB0aGVpciBzZWNyZXRzLg==",
            163, 1, "1", "U3VpY2lkZSBtaXNzaW9u"
    );
    static final Ad A_ROT13_ENCRYPTED_AD = new Ad(
            "dEegahRU",
            "Xvyy Lhhan Znggurjfba jvgu ohpxrg naq znxr Xnyla Pbyoreg sebz fjnzc va Oynpxperfg gb gnxr gur oynzr",
            115, 2, "2", "Vzcbffvoyr"
    );

    static final ShopItem A_HEALING_POTION = new ShopItem("hpot", "Healing potion", 50);
    static final ShopItem A_CLAW_SHARPENING = new ShopItem("cs", "Claw Sharpening", 100);
    static final ShopItem A_CHEAP_TRINKET = new ShopItem("cheap", "Cheap Trinket", 10);
    static final ShopItem A_SHINY_SWORD = new ShopItem("item1", "Shiny Sword", 50);

    static Ad anAd(String id, int reward, int expiresIn, ProbabilityTier tier) {
        return new Ad(id, A_DEFAULT_MESSAGE, reward, expiresIn, null, tier.label);
    }

    static Ad aSureThing(String id, int reward, int expiresIn) {
        return anAd(id, reward, expiresIn, ProbabilityTier.SURE_THING);
    }

    static SuccessRateTracker aSuccessRateTracker() {
        return new SuccessRateTracker();
    }

    static GameState aGameState(int lives) {
        return new GameState(A_DEFAULT_GAME_ID, lives, 0, 0, 0, 0, 0);
    }

    static GameState aGameState(int lives, int gold, int level) {
        return new GameState(A_DEFAULT_GAME_ID, lives, gold, level, 0, 0, 0);
    }

    static FakeGameClient aClientWithLives(int lives) {
        return new FakeGameClient(aGameState(lives));
    }

    static GameLoop aGameLoop(FakeGameClient client) {
        return new GameLoop(client, new SuccessRateTracker());
    }

    static SolveResult aSolveResult(int livesAfter, int goldAfter, int turn) {
        return new SolveResult(true, livesAfter, goldAfter, 0, 0, turn, "ok");
    }

    static void queueSureThing(FakeGameClient client, int livesAfter, int goldAfter) {
        client.queueAdBatch(List.of(A_SURE_THING_AD));
        client.queueSolveResult(aSolveResult(livesAfter, goldAfter, 1));
    }

    private TestFixtures() {}
}
