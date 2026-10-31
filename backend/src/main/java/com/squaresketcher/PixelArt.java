package com.squaresketcher;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * A stored piece of pixel art. {@code pixels} is a row-major matrix of
 * {@code #RRGGBB} colors.
 */
@Document(collection = "pixel-art")
public record PixelArt(@Id String id, String name, List<List<String>> pixels) {

    public PixelArt {
        pixels = pixels == null ? List.of() : pixels.stream().map(List::copyOf).toList();
    }

    public PixelArt withId(String newId) {
        return new PixelArt(newId, name, pixels);
    }
}
