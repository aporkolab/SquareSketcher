package com.squaresketcher;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PixelArtRequestTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    @Test
    void acceptsValidRequest() {
        var request = new PixelArtRequest("Art", List.of(List.of("#FFFFFF", "#abcdef"), List.of("#000000", "#123456")));
        assertThat(validator.validate(request)).isEmpty();
    }

    @Test
    void rejectsTooLongName() {
        var request = new PixelArtRequest("x".repeat(PixelArtRequest.MAX_NAME_LENGTH + 1), List.of(List.of("#FFFFFF")));
        assertThat(validator.validate(request)).extracting(v -> v.getPropertyPath().toString()).containsExactly("name");
    }

    @Test
    void rejectsRaggedRows() {
        var request = new PixelArtRequest("Art", List.of(List.of("#FFFFFF", "#FFFFFF"), List.of("#FFFFFF")));
        assertThat(validator.validate(request)).extracting(v -> v.getPropertyPath().toString()).containsExactly("rectangular");
    }

    @Test
    void rejectsNullRowAndNullColor() {
        List<List<String>> pixels = new ArrayList<>();
        pixels.add(Arrays.asList("#FFFFFF", null));
        pixels.add(null);
        assertThat(validator.validate(new PixelArtRequest("Art", pixels))).isNotEmpty();
    }

    @Test
    void rejectsShortHexColor() {
        assertThat(validator.validate(new PixelArtRequest("Art", List.of(List.of("#FFF"))))).isNotEmpty();
    }

    @Test
    void mapsToPixelArtWithTrimmedName() {
        PixelArt art = new PixelArtRequest(" Art ", List.of(List.of("#FFFFFF"))).toPixelArt("7");
        assertThat(art).isEqualTo(new PixelArt("7", "Art", List.of(List.of("#FFFFFF"))));
    }
}
