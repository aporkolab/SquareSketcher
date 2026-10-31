package com.squaresketcher;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PixelArtServiceTest {

    private static final List<List<String>> PIXELS = List.of(List.of("#FFFFFF"));

    @Mock
    private PixelArtRepository repository;

    @InjectMocks
    private PixelArtService service;

    @Test
    void createSavesWithoutIdAndTrimmedName() {
        when(repository.save(any())).thenAnswer(inv -> inv.<PixelArt>getArgument(0).withId("generated"));

        PixelArt created = service.create(new PixelArtRequest("  Art  ", PIXELS));

        ArgumentCaptor<PixelArt> captor = ArgumentCaptor.forClass(PixelArt.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().id()).isNull();
        assertThat(captor.getValue().name()).isEqualTo("Art");
        assertThat(created.id()).isEqualTo("generated");
    }

    @Test
    void updateSavesUnderThePathId() {
        when(repository.existsById("42")).thenReturn(true);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        PixelArt updated = service.update("42", new PixelArtRequest("Art", PIXELS));

        assertThat(updated.id()).isEqualTo("42");
        assertThat(updated.pixels()).isEqualTo(PIXELS);
    }

    @Test
    void updateOfUnknownIdFailsWithoutSaving() {
        when(repository.existsById("42")).thenReturn(false);

        assertThatThrownBy(() -> service.update("42", new PixelArtRequest("Art", PIXELS)))
                .isInstanceOf(PixelArtNotFoundException.class)
                .hasMessageContaining("42");
        verify(repository, never()).save(any());
    }

    @Test
    void findByIdReturnsStoredArt() {
        PixelArt stored = new PixelArt("1", "Art", PIXELS);
        when(repository.findById("1")).thenReturn(Optional.of(stored));

        assertThat(service.findById("1")).isEqualTo(stored);
    }

    @Test
    void findByIdOfUnknownIdThrows() {
        when(repository.findById("1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById("1")).isInstanceOf(PixelArtNotFoundException.class);
    }

    @Test
    void findAllReturnsRepositoryContent() {
        List<PixelArt> all = List.of(new PixelArt("1", "Art", PIXELS));
        when(repository.findAll()).thenReturn(all);

        assertThat(service.findAll()).isEqualTo(all);
    }
}
