package com.squaresketcher;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PixelArtController.class)
public class PixelArtControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PixelArtRepository repository;

    @Test
    public void getAllShouldReturnOk() throws Exception {
        when(repository.findAll()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/pixel-art"))
                .andExpect(status().isOk());
    }

    @Test
    public void getByIdShouldReturnOk() throws Exception {
        PixelArt pixelArt = new PixelArt();
        pixelArt.setId("1");
        pixelArt.setName("test");
        when(repository.findById("1")).thenReturn(java.util.Optional.of(pixelArt));
        mockMvc.perform(get("/api/pixel-art/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void getByIdShouldReturnNotFound() throws Exception {
        when(repository.findById("1")).thenReturn(java.util.Optional.empty());
        mockMvc.perform(get("/api/pixel-art/1"))
                .andExpect(status().isNotFound());
    }
}
