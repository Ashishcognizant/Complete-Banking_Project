//package com.cts.gateway;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//
//@Component
//public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {
//
//    private static final String SECRET = "TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg";
//    private final SecretKey key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(SECRET));
//
//    public JwtAuthenticationFilter() {
//        super(Config.class);
//    }
//
//    @Override
//    public GatewayFilter apply(Config config) {
//        return (exchange, chain) -> {
//            ServerHttpRequest request = exchange.getRequest();
//            
//            if (!request.getHeaders().containsKey("Authorization")) {
//                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                return exchange.getResponse().setComplete();
//            }
//
//            String authHeader = request.getHeaders().getFirst("Authorization");
//            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                return exchange.getResponse().setComplete();
//            }
//
//            String token = authHeader.substring(7);
//            try {
//                Claims claims = Jwts.parserBuilder()
//                        .setSigningKey(key)
//                        .build()
//                        .parseClaimsJws(token)
//                        .getBody();
//
//                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
//                        .header("Authorization", authHeader)
//                        .build();
//
//                return chain.filter(exchange.mutate().request(modifiedRequest).build());
//            } catch (Exception e) {
//                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                return exchange.getResponse().setComplete();
//            }
//        };
//    }
//
//    public static class Config {
//    }
//}
