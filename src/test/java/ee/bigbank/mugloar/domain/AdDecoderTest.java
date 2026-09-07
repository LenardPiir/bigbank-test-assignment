package ee.bigbank.mugloar.domain;

import org.junit.jupiter.api.Test;

import static ee.bigbank.mugloar.domain.TestFixtures.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AdDecoderTest {

    @Test
    void decodesBase64EncryptedAdFields() {
        Ad decoded = AdDecoder.decode(A_BASE64_ENCRYPTED_AD);

        assertEquals("WdZ9mlzo", decoded.adId());
        assertEquals("Infiltrate The Grizzly Gorillas and recover their secrets.", decoded.message());
        assertEquals(ProbabilityTier.SUICIDE_MISSION.label, decoded.probability());
    }

    @Test
    void leavesNonEncryptedAdUnchanged() {
        Ad plainAd = aSureThing("abc123", A_DEFAULT_REWARD, A_DEFAULT_EXPIRY);

        assertEquals(plainAd, AdDecoder.decode(plainAd));
    }

    @Test
    void decodesRot13EncryptedAdFields() {
        Ad decoded = AdDecoder.decode(A_ROT13_ENCRYPTED_AD);

        assertEquals("Kill Yuuna Matthewson with bucket and make Kalyn Colbert from swamp in Blackcrest to take the blame", decoded.message());
        assertEquals(ProbabilityTier.IMPOSSIBLE.label, decoded.probability());
    }

    @Test
    void throwsOnUnknownEncryptionType() {
        Ad unknownEncryption = new Ad("id", A_DEFAULT_MESSAGE, A_DEFAULT_REWARD, A_DEFAULT_EXPIRY, "99", ProbabilityTier.SURE_THING.label);

        assertThrows(IllegalArgumentException.class, () -> AdDecoder.decode(unknownEncryption));
    }
}
