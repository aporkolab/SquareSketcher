package com.squaresketcher;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "pixel-art")
public class PixelArt {

    @Id
    private String id;
    private String name;
    private String[][] pixels;
}
