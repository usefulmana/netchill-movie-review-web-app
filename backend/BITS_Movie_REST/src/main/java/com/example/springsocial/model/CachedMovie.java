package com.example.springsocial.model;

// Caching Model for popular movies

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.data.redis.core.RedisHash;
import java.io.Serializable;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@RedisHash("CachedMovie")
public class CachedMovie implements Serializable {
    private static final long serialVersionUID = 2L;

    private @NonNull Long id;
    private @NonNull Movie movie;
    private @NonNull String type;
//    private @NonNull String localDateTime;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime localDateTime;

    public CachedMovie(@NonNull Long id, @NonNull Movie movie, @NonNull String type) {
        this.id = id;
        this.movie = movie;
        this.type = type;
        this.localDateTime = LocalDateTime.now();
    }
}
