package ee.bigbank.mugloar.domain;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

class AdDecoder {

    static Ad decode(Ad ad) {
        if (ad.encrypted() == null) {
            return ad;
        }
        return switch (ad.encrypted()) {
            case "1" -> new Ad(decodeBase64(ad.adId()), decodeBase64(ad.message()), ad.reward(), ad.expiresIn(), ad.encrypted(), decodeBase64(ad.probability()));
            case "2" -> new Ad(decodeRot13(ad.adId()), decodeRot13(ad.message()), ad.reward(), ad.expiresIn(), ad.encrypted(), decodeRot13(ad.probability()));
            default -> throw new IllegalArgumentException("Unknown encryption type: " + ad.encrypted());
        };
    }

    private static String decodeBase64(String value) {
        return new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
    }

    private static final int ALPHABET_SIZE = 26;
    private static final int ROT13_SHIFT = 13;

    private static String decodeRot13(String value) {
        StringBuilder result = new StringBuilder();
        for (char character : value.toCharArray()) {
            result.append(rotateCharacter(character));
        }
        return result.toString();
    }

    private static char rotateCharacter(char character) {
        if (Character.isLowerCase(character)) {
            return (char) ('a' + (character - 'a' + ROT13_SHIFT) % ALPHABET_SIZE);
        }
        if (Character.isUpperCase(character)) {
            return (char) ('A' + (character - 'A' + ROT13_SHIFT) % ALPHABET_SIZE);
        }
        return character;
    }
}
