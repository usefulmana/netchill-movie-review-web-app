package com.example.springsocial.util;


import fr.plaisance.bitly.Bit;

public class URLShortener {
    public static String shorten(String longUrl) {
        String access_token = "eded2a579fe6a39926fdf37ef7eb4720bd3dc48e";
        return Bit.ly(access_token).shorten(longUrl);
    }
}
