package com.squaresketcher;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** Ensures the record maps to the same document shape the old String[][] entity used. */
class PixelArtMappingTest {

    private final MappingMongoConverter converter = createConverter();

    private static MappingMongoConverter createConverter() {
        MongoMappingContext context = new MongoMappingContext();
        context.afterPropertiesSet();
        MappingMongoConverter converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, context);
        converter.afterPropertiesSet();
        return converter;
    }

    @Test
    void readsExistingDocuments() {
        Document document = new Document("_id", "1")
                .append("name", "Old art")
                .append("pixels", List.of(List.of("#FFFFFF", "#000000")))
                .append("_class", "com.squaresketcher.PixelArt");

        PixelArt art = converter.read(PixelArt.class, document);

        assertThat(art).isEqualTo(new PixelArt("1", "Old art", List.of(List.of("#FFFFFF", "#000000"))));
    }

    @Test
    void writesNestedArrays() {
        Document document = new Document();

        converter.write(new PixelArt("1", "Art", List.of(List.of("#FFFFFF"))), document);

        assertThat(document.get("_id")).isEqualTo("1");
        assertThat(document.get("pixels")).isEqualTo(List.of(List.of("#FFFFFF")));
    }
}
