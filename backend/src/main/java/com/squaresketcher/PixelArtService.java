package com.squaresketcher;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PixelArtService {

    private static final Logger log = LoggerFactory.getLogger(PixelArtService.class);

    private final PixelArtRepository repository;

    public PixelArtService(PixelArtRepository repository) {
        this.repository = repository;
    }

    public List<PixelArt> findAll() {
        return repository.findAll();
    }

    public PixelArt findById(String id) {
        return repository.findById(id).orElseThrow(() -> new PixelArtNotFoundException(id));
    }

    public PixelArt create(PixelArtRequest request) {
        PixelArt saved = repository.save(request.toPixelArt(null));
        log.info("Created pixel art {}", saved.id());
        return saved;
    }

    public PixelArt update(String id, PixelArtRequest request) {
        if (!repository.existsById(id)) {
            throw new PixelArtNotFoundException(id);
        }
        PixelArt saved = repository.save(request.toPixelArt(id));
        log.info("Updated pixel art {}", id);
        return saved;
    }
}
