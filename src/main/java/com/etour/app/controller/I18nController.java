package com.etour.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/i18n")
public class I18nController {
    @Autowired
    private MessageSource messageSource;
    // All translation keys for login page
    private static final String[] LOGIN_KEYS = {
            "login.title", "login.subtitle", "login.email", "login.password",
            "login.button", "login.signing_in", "login.no_account",
            "login.register", "login.error", "app.name"
    };

    // GET /api/i18n/{locale} - Get all translations for a locale
    @GetMapping("/{locale}")
    public Map<String, String> getTranslations(@PathVariable String locale) {
        Locale loc = Locale.forLanguageTag(locale);
        Map<String, String> translations = new HashMap<>();

        for (String key : LOGIN_KEYS) {
            try {
                translations.put(key, messageSource.getMessage(key, null, loc));
            } catch (Exception e) {
                translations.put(key, key); // Fallback to key if not found
            }
        }
        return translations;
    }

    // GET /api/i18n/languages - Get list of supported languages
    @GetMapping("/languages")
    public List<Map<String, String>> getSupportedLanguages() {
        List<Map<String, String>> languages = new ArrayList<>();

        languages.add(Map.of("code", "en", "name", "English", "nativeName", "English"));
        languages.add(Map.of("code", "hi", "name", "Hindi", "nativeName", "हिंदी"));
        languages.add(Map.of("code", "mr", "name", "Marathi", "nativeName", "मराठी"));

        return languages;
    }
}