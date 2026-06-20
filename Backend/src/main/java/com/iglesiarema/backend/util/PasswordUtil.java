package com.iglesiarema.backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String hash(String password) {
        if (password == null) return null;
        return encoder.encode(password);
    }

    public static boolean verify(String password, String hashed) {
        if (password == null || hashed == null) return false;
        return encoder.matches(password, hashed);
    }
}
