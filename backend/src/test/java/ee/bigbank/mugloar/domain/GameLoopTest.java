package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import java.util.List;

import static ee.bigbank.mugloar.domain.TestFixtures.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class GameLoopTest {

    @Test
    void stopsWhenLivesReachZero() {
        FakeGameClient client = aClientWithLives(1);
        queueSureThing(client, 0, A_DEFAULT_REWARD);

        GameState finalState = aGameLoop(client).play();

        assertEquals(0, finalState.lives());
    }

    @Test
    void stopsGracefullyWhenNoAdsAreAvailable() {
        FakeGameClient client = aClientWithLives(3);

        GameState finalState = aGameLoop(client).play();

        assertEquals(3, finalState.lives());
        assertEquals(A_DEFAULT_GAME_ID, finalState.gameId());
    }

    @Test
    void fetchesFreshAdsBeforeEachSolveRatherThanReusingStaleBatch() {
        FakeGameClient client = aClientWithLives(2);

        client.queueAdBatch(List.of(aSureThing("first", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY)));
        client.queueSolveResult(aSolveResult(1, A_DEFAULT_REWARD, 1));

        client.queueAdBatch(List.of(aSureThing("second", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY)));
        client.queueSolveResult(aSolveResult(0, A_MEDIUM_REWARD, 2));

        aGameLoop(client).play();

        assertEquals(List.of("first", "second"), client.solvedAdIds);
    }

    @Test
    void buysAnItemWhenEnoughGoldIsAvailable() {
        FakeGameClient client = aClientWithLives(5);
        client.queueAdBatch(List.of(A_SURE_THING_AD));
        client.queueSolveResult(aSolveResult(5, 300, 1));
        client.setShopItems(List.of(A_SHINY_SWORD));

        aGameLoop(client).play();

        assertEquals(List.of("item1"), client.purchasedItemIds);
    }

    @Test
    void buysNothingWhenGoldIsInsufficientForAnyItem() {
        FakeGameClient client = aClientWithLives(1);
        queueSureThing(client, 0, 10);
        client.setShopItems(List.of(A_SHINY_SWORD));

        aGameLoop(client).play();

        assertEquals(List.of(), client.purchasedItemIds);
    }

    @Test
    void decodesEncryptedAdsBeforeSolving() {
        FakeGameClient client = aClientWithLives(1);
        client.queueAdBatch(List.of(A_BASE64_ENCRYPTED_AD));
        client.queueSolveResult(aSolveResult(0, 163, 1));

        aGameLoop(client).play();

        assertEquals(List.of("WdZ9mlzo"), client.solvedAdIds);
    }

    @Test
    void doesNotQueryShopAfterLivesReachZero() {
        FakeGameClient client = aClientWithLives(1);
        queueSureThing(client, 0, A_DEFAULT_REWARD);

        aGameLoop(client).play();

        assertFalse(client.shopWasQueried);
    }

    @Test
    void prioritizesHealingPotionOverCheaperItems() {
        FakeGameClient client = aClientWithLives(1);
        queueSureThing(client, 1, A_MEDIUM_REWARD);
        client.setShopItems(List.of(A_CHEAP_TRINKET, A_HEALING_POTION));

        aGameLoop(client).play();

        assertEquals(List.of("hpot"), client.purchasedItemIds);
    }

    @Test
    void savesGoldForHealingPotionInsteadOfBuyingCheaperItems() {
        FakeGameClient client = aClientWithLives(1);
        queueSureThing(client, 1, 30);
        client.setShopItems(List.of(A_CHEAP_TRINKET, A_HEALING_POTION));

        aGameLoop(client).play();

        assertEquals(List.of(), client.purchasedItemIds);
    }

    @Test
    void buysStatItemInsteadOfHoardingWhenLivesAreHealthy() {
        FakeGameClient client = aClientWithLives(10);
        queueSureThing(client, 10, 400);
        client.setShopItems(List.of(A_CLAW_SHARPENING, A_HEALING_POTION));

        aGameLoop(client).play();

        assertEquals(List.of("cs"), client.purchasedItemIds);
    }

    @Test
    void buysHealingPotionWhenLivesAreLow() {
        FakeGameClient client = aClientWithLives(3);
        queueSureThing(client, 3, 200);
        client.setShopItems(List.of(A_CLAW_SHARPENING, A_HEALING_POTION));

        aGameLoop(client).play();

        assertEquals(List.of("hpot"), client.purchasedItemIds);
    }

    @Test
    void skipsRiskyAdsWhenOnlyOneLifeRemains() {
        FakeGameClient client = new FakeGameClient(aGameState(1, A_MEDIUM_REWARD, 0));
        Ad riskyAd = anAd("r1", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.GAMBLE);
        client.queueAdBatch(List.of(riskyAd));
        client.setShopItems(List.of(A_CHEAP_TRINKET));

        aGameLoop(client).play();

        assertEquals(List.of(), client.solvedAdIds);
    }

    @Test
    void skipsVeryRiskyAdsAtLowLevels() {
        FakeGameClient client = new FakeGameClient(aGameState(3, A_MEDIUM_REWARD, 1));
        Ad suicidalAd = anAd("s1", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.PLAYING_WITH_FIRE);
        client.queueAdBatch(List.of(suicidalAd));
        client.setShopItems(List.of(A_CHEAP_TRINKET));

        aGameLoop(client).play();

        assertEquals(List.of(), client.solvedAdIds);
    }

    @Test
    void allowsRiskyAdsAtHighLevels() {
        FakeGameClient client = new FakeGameClient(aGameState(5, 0, 15));
        Ad riskyAd = anAd("r1", A_HIGH_REWARD, A_DEFAULT_EXPIRY, ProbabilityTier.PLAYING_WITH_FIRE);
        client.queueAdBatch(List.of(riskyAd));
        client.queueSolveResult(aSolveResult(5, A_HIGH_REWARD, 1));

        aGameLoop(client).play();

        assertEquals(List.of("r1"), client.solvedAdIds);
    }
}
