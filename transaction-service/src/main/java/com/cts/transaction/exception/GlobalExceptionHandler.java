package com.cts.transaction.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, Object>> handleFeignException(FeignException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        
        int status = ex.status();
        String responseBody = ex.contentUTF8();
        
        error.put("status", status);
        
        if (status == 404) {
            error.put("error", "Not Found");
            if (responseBody.contains("Account not found with ID")) {
                int startIdx = responseBody.indexOf("Account not found");
                int endIdx = responseBody.indexOf("\"", startIdx + 20);
                if (endIdx > startIdx) {
                    error.put("message", responseBody.substring(startIdx, endIdx));
                } else {
                    error.put("message", "Account not found");
                }
            } else {
                error.put("message", "Account not found");
            }
        } else if (status == 403) {
            error.put("error", "Forbidden");
            error.put("message", "Access denied: Admin role required");
        } else {
            error.put("error", "Service Error");
            error.put("message", "Error communicating with account service");
        }
        
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.put("error", "Internal Server Error");
        error.put("message", "An error occurred: " + ex.getMessage());
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
