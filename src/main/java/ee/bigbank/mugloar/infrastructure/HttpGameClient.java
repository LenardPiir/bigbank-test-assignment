package ee.bigbank.mugloar.infrastructure;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import ee.bigbank.mugloar.domain.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class HttpGameClient implements GameClient {
    private static final String BASE_URL = "https://dragonsofmugloar.com/api/v2";
    private static final int HTTP_TOO_MANY_REQUESTS = 429;
    private static final int MAX_RETRIES = 5;
    private static final long INITIAL_BACKOFF_MS = 500;
    private static final long THROTTLE_MS = 50;

    private final HttpClient http = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public GameState startGame() {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/game/start"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        return send(request, new TypeReference<>() {});
    }

    @Override
    public List<Ad> getAds(String gameId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/" + gameId + "/messages"))
                .GET()
                .build();

        return send(request, new TypeReference<>() {});
    }

    @Override
    public SolveResult solve(String gameId, String adId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/" + gameId + "/solve/" + adId))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        return send(request, new TypeReference<>() {});
    }

    @Override
    public List<ShopItem> getShopItems(String gameId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/" + gameId + "/shop"))
                .GET()
                .build();

        return send(request, new TypeReference<>() {});
    }

    @Override
    public PurchaseResult buyItem(String gameId, String itemId) {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/" + gameId + "/shop/buy/" + itemId))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        return send(request, new TypeReference<>() {});
    }

    private <T> T send(HttpRequest request, TypeReference<T> type) {
        String body = sendWithRetry(request);
        try {
            return mapper.readValue(body, type);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse response body: " + body, e);
        }
    }

    private String sendWithRetry(HttpRequest request) {
        IOException lastFailure = null;
        for (int attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            sleep(THROTTLE_MS);
            try {
                HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
                if (response.statusCode() == HttpURLConnection.HTTP_OK) {
                    return response.body();
                }
                if (response.statusCode() != HTTP_TOO_MANY_REQUESTS) {
                    throw new RuntimeException("HTTP " + response.statusCode() + " from " + request.uri() + ": " + response.body());
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Request interrupted: " + request.uri(), e);
            } catch (IOException e) {
                lastFailure = e;
            }
            sleep(INITIAL_BACKOFF_MS << attempt);
        }
        throw new RuntimeException("Request failed after " + MAX_RETRIES + " retries: " + request.uri(), lastFailure);
    }

    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
