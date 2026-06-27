package com.aios.core.global.security;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${aios.jwt.secret}") String secret,
            @Value("${aios.jwt.expiration-minutes:1440}") long expirationMinutes
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationMinutes * 60;
    }

    public String createToken(Long userId, String email) {
        try {
            String header = encodeJson(Map.of("alg", "HS256", "typ", "JWT"));
            long now = Instant.now().getEpochSecond();
            String payload = encodeJson(Map.of("sub", email, "uid", userId, "iat", now, "exp", now + expirationSeconds));
            String body = header + "." + payload;
            return body + "." + sign(body);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to create token", ex);
        }
    }

    public String validateAndGetEmail(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !constantTimeEquals(sign(parts[0] + "." + parts[1]), parts[2])) {
                return null;
            }
            Map<String, Object> payload = objectMapper.readValue(Base64.getUrlDecoder().decode(parts[1]), new TypeReference<>() {});
            Number exp = (Number) payload.get("exp");
            if (exp == null || exp.longValue() < Instant.now().getEpochSecond()) {
                return null;
            }
            return (String) payload.get("sub");
        } catch (Exception ex) {
            return null;
        }
    }

    private String encodeJson(Map<String, Object> value) throws Exception {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(objectMapper.writeValueAsBytes(value));
    }

    private String sign(String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret, "HmacSHA256"));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private boolean constantTimeEquals(String left, String right) {
        if (left.length() != right.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < left.length(); i++) {
            result |= left.charAt(i) ^ right.charAt(i);
        }
        return result == 0;
    }
}
