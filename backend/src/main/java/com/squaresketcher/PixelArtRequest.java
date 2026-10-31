package com.squaresketcher;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Payload for creating or updating pixel art. Any {@code id} sent by the
 * client is ignored; the id comes from the URL or is generated.
 */
public record PixelArtRequest(
        @NotBlank @Size(max = PixelArtRequest.MAX_NAME_LENGTH) String name,
        @NotEmpty @Size(max = PixelArtRequest.MAX_SIDE) List<
                @NotEmpty @Size(max = PixelArtRequest.MAX_SIDE) List<
                        @NotNull @Pattern(regexp = PixelArtRequest.COLOR_PATTERN) String>> pixels) {

    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_SIDE = 128;
    public static final String COLOR_PATTERN = "^#[0-9A-Fa-f]{6}$";

    @AssertTrue(message = "all rows must have the same length")
    public boolean isRectangular() {
        if (pixels == null || pixels.isEmpty() || pixels.getFirst() == null) {
            // Reported by the field constraints.
            return true;
        }
        int width = pixels.getFirst().size();
        return pixels.stream().allMatch(row -> row != null && row.size() == width);
    }

    public PixelArt toPixelArt(String id) {
        return new PixelArt(id, name.strip(), pixels);
    }
}
