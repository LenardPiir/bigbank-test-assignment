package ee.bigbank.mugloar.domain;

public record Ad(String adId, String message, int reward, int expiresIn, String encrypted, String probability) {
}
