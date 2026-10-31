package com.squaresketcher;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PixelArtController.class)
class PixelArtControllerTest {

    private static final String VALID_BODY = """
            {"name": "Smiley", "pixels": [["#FFFFFF", "#000000"], ["#ff0000", "#00FF00"]]}
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PixelArtService service;

    private static PixelArt art(String id) {
        return new PixelArt(id, "Smiley", List.of(List.of("#FFFFFF", "#000000"), List.of("#ff0000", "#00FF00")));
    }

    @Test
    void getAllReturnsEveryArt() throws Exception {
        when(service.findAll()).thenReturn(List.of(art("1"), art("2")));

        mockMvc.perform(get("/api/pixel-art"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].pixels[1][0]").value("#ff0000"));
    }

    @Test
    void getByIdReturnsTheArt() throws Exception {
        when(service.findById("1")).thenReturn(art("1"));

        mockMvc.perform(get("/api/pixel-art/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Smiley"));
    }

    @Test
    void getByIdReturnsProblemDetailWhenMissing() throws Exception {
        when(service.findById("1")).thenThrow(new PixelArtNotFoundException("1"));

        mockMvc.perform(get("/api/pixel-art/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("Pixel art not found: 1"));
    }

    @Test
    void createReturns201WithLocation() throws Exception {
        when(service.create(any())).thenReturn(art("abc"));

        mockMvc.perform(post("/api/pixel-art").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/pixel-art/abc"))
                .andExpect(jsonPath("$.id").value("abc"));
    }

    @Test
    void updateDelegatesWithPathId() throws Exception {
        when(service.update(eq("abc"), any())).thenReturn(art("abc"));

        mockMvc.perform(put("/api/pixel-art/abc").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("abc"));
        verify(service).update(eq("abc"), any(PixelArtRequest.class));
    }

    @Test
    void updateOfUnknownArtReturns404() throws Exception {
        when(service.update(eq("nope"), any())).thenThrow(new PixelArtNotFoundException("nope"));

        mockMvc.perform(put("/api/pixel-art/nope").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isNotFound());
    }

    @Test
    void createRejectsBlankName() throws Exception {
        assertBadRequest("""
                {"name": " ", "pixels": [["#FFFFFF"]]}
                """);
    }

    @Test
    void createRejectsMissingPixels() throws Exception {
        assertBadRequest("""
                {"name": "Art"}
                """);
    }

    @Test
    void createRejectsInvalidColor() throws Exception {
        assertBadRequest("""
                {"name": "Art", "pixels": [["red"]]}
                """);
    }

    @Test
    void createRejectsRaggedRows() throws Exception {
        assertBadRequest("""
                {"name": "Art", "pixels": [["#FFFFFF", "#FFFFFF"], ["#FFFFFF"]]}
                """);
    }

    @Test
    void createRejectsOversizedCanvas() throws Exception {
        String row = "[" + String.join(",", java.util.Collections.nCopies(PixelArtRequest.MAX_SIDE + 1, "\"#FFFFFF\"")) + "]";
        assertBadRequest("{\"name\": \"Art\", \"pixels\": [" + row + "]}");
    }

    @Test
    void createRejectsMalformedJson() throws Exception {
        assertBadRequest("{not json");
    }

    private void assertBadRequest(String body) throws Exception {
        mockMvc.perform(post("/api/pixel-art").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
        verifyNoInteractions(service);
    }
}
