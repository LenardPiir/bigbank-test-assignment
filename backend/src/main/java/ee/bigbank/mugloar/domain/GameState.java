package ee.bigbank.mugloar.domain;

public record GameState(String gameId, int lives, int gold, int level, int score, int highScore, int turn) {

    GameState withSolveResult(SolveResult result) {
        return new GameState(gameId, result.lives(), result.gold(), level, result.score(), result.highScore(), result.turn());
    }

    GameState withPurchaseResult(PurchaseResult result) {
        return new GameState(gameId, result.lives(), result.gold(), result.level(), score, highScore, result.turn());
    }
}
