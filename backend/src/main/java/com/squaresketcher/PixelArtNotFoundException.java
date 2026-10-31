package com.squaresketcher;

public class PixelArtNotFoundException extends RuntimeException {

    public PixelArtNotFoundException(String id) {
        super("Pixel art not found: " + id);
    }
}
